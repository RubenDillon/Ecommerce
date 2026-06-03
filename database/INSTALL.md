# Guía de Instalación - Backend MySQL E-commerce

## 📋 Requisitos Previos

- Servidor Red Hat Enterprise Linux 9
- IP: 10.242.64.5
- Acceso SSH con usuario sudo
- Conexión a internet para descargar paquetes

---

## 🚀 Instalación Paso a Paso

### Paso 1: Preparar el Servidor

```bash
# Conectar al servidor
ssh usuario@10.242.64.5

# Crear directorio para el proyecto
mkdir -p ~/ecommerce/database
cd ~/ecommerce/database
```

### Paso 2: Copiar los Scripts

Desde tu máquina local, copia todos los archivos al servidor:

```bash
# En tu máquina local
cd /Users/rubendillon/Desktop/Ecommerce/database
scp -r * usuario@10.242.64.5:~/ecommerce/database/
```

### Paso 3: Instalar MySQL

```bash
# En el servidor 10.242.64.5
cd ~/ecommerce/database

# Dar permisos de ejecución a los scripts
chmod +x *.sh

# Ejecutar instalación de MySQL
sudo ./install_mysql.sh
```

**Salida esperada:**
```
==========================================
Instalación de MySQL en RHEL 9
==========================================
Actualizando el sistema...
Instalando MySQL Server...
Habilitando y iniciando MySQL...
MySQL instalado correctamente
==========================================
```

### Paso 4: Configurar Seguridad de MySQL

```bash
# Ejecutar configuración segura
sudo mysql_secure_installation
```

**Responder a las preguntas:**
- `Set root password?` → **Y** (Sí)
- Ingresar contraseña segura para root (¡GUARDAR ESTA CONTRASEÑA!)
- `Remove anonymous users?` → **Y**
- `Disallow root login remotely?` → **Y**
- `Remove test database?` → **Y**
- `Reload privilege tables?` → **Y**

### Paso 5: Configurar Acceso Remoto

```bash
# Ejecutar script de configuración
sudo ./configure_mysql.sh
```

**Se solicitará:**
1. Contraseña root de MySQL (la que configuraste en el paso anterior)
2. Contraseña para el usuario `ecommerce_user` (¡GUARDAR ESTA CONTRASEÑA!)

**Salida esperada:**
```
==========================================
Configuración de MySQL para acceso remoto
==========================================
Configurando MySQL para conexiones remotas...
Reiniciando MySQL...
Creando usuario de aplicación...
Configuración completada
==========================================

Información de conexión:
Host: 10.242.64.5
Puerto: 3306
Usuario: ecommerce_user
Base de datos: ecommerce
```

### Paso 6: Crear Base de Datos y Estructura

```bash
# Crear base de datos y tablas
mysql -u root -p < 01_create_database.sql
```

Ingresar la contraseña root cuando se solicite.

**Verificar que se crearon las tablas:**
```bash
mysql -u root -p -e "USE ecommerce; SHOW TABLES;"
```

**Salida esperada:**
```
+---------------------+
| Tables_in_ecommerce |
+---------------------+
| Ciudades            |
| Clases              |
| Clientes            |
| Items               |
| Ordenes             |
| Pais                |
| Productos           |
+---------------------+
```

### Paso 7: Cargar Datos Iniciales

**Opción A: Usar script consolidado (recomendado)**
```bash
mysql -u root -p < 02_seed_data.sql
```

**Opción B: Usar scripts separados**
```bash
mysql -u root -p < 02_seed_data_part1.sql
mysql -u root -p < 02_seed_data_part2.sql
mysql -u root -p < 02_seed_data_part3.sql
```

**Verificar datos cargados:**
```bash
mysql -u root -p -e "
USE ecommerce;
SELECT 'Países:' AS Tabla, COUNT(*) AS Registros FROM Pais
UNION ALL SELECT 'Ciudades:', COUNT(*) FROM Ciudades
UNION ALL SELECT 'Clases:', COUNT(*) FROM Clases
UNION ALL SELECT 'Productos:', COUNT(*) FROM Productos;
"
```

**Salida esperada:**
```
+------------+-----------+
| Tabla      | Registros |
+------------+-----------+
| Países:    |         5 |
| Ciudades:  |        50 |
| Clases:    |        20 |
| Productos: |        50 |
+------------+-----------+
```

### Paso 8: Ejecutar Pruebas de Validación

```bash
mysql -u root -p < 04_test_queries.sql
```

Este script ejecutará múltiples pruebas:
- ✓ Verificación de estructura
- ✓ Conteo de datos
- ✓ Verificación de foreign keys
- ✓ Inserción de cliente de prueba
- ✓ Creación de orden de prueba
- ✓ Validación de restricciones
- ✓ Consultas útiles
- ✓ Estadísticas

### Paso 9: Probar Conexión Remota

**Desde el servidor del middleware:**

```bash
# Copiar el script de prueba
scp usuario@10.242.64.5:~/ecommerce/database/test_connection.sh .

# Dar permisos de ejecución
chmod +x test_connection.sh

# Ejecutar prueba
./test_connection.sh
```

Ingresar la contraseña de `ecommerce_user` cuando se solicite.

**Salida esperada:**
```
==========================================
Prueba de Conexión a MySQL
==========================================
Probando conexión a 10.242.64.5:3306...
Conexión exitosa!
==========================================
✓ Conexión exitosa
==========================================
```

---

## ✅ Verificación Final

### Verificar Estado de MySQL

```bash
# Ver estado del servicio
sudo systemctl status mysqld

# Ver logs
sudo tail -50 /var/log/mysqld.log

# Verificar puerto abierto
sudo netstat -tlnp | grep 3306
```

### Verificar Firewall

```bash
# Ver reglas de firewall
sudo firewall-cmd --list-all

# Debe mostrar mysql en services
```

### Conectar a MySQL

```bash
# Como root
mysql -u root -p

# Como usuario de aplicación (local)
mysql -u ecommerce_user -p

# Como usuario de aplicación (remoto desde middleware)
mysql -h 10.242.64.5 -u ecommerce_user -p
```

### Consultas de Verificación

```sql
-- Conectar a la base de datos
USE ecommerce;

-- Ver todas las tablas
SHOW TABLES;

-- Contar registros
SELECT 
    'Pais' AS Tabla, COUNT(*) AS Total FROM Pais
UNION ALL
SELECT 'Ciudades', COUNT(*) FROM Ciudades
UNION ALL
SELECT 'Clases', COUNT(*) FROM Clases
UNION ALL
SELECT 'Productos', COUNT(*) FROM Productos;

-- Ver productos por categoría
SELECT 
    c.Nombre AS Categoria,
    COUNT(p.IdProducto) AS Productos,
    SUM(p.Stock) AS Stock
FROM Clases c
LEFT JOIN Productos p ON c.IdTipo = p.IdTipo
GROUP BY c.IdTipo, c.Nombre
ORDER BY c.Nombre;

-- Ver valor del inventario
SELECT 
    SUM(Valor_costo * Stock) AS Costo_Total,
    SUM(Valor_venta * Stock) AS Venta_Total,
    SUM((Valor_venta - Valor_costo) * Stock) AS Margen_Total
FROM Productos;
```

---

## 🔧 Troubleshooting

### Problema: MySQL no inicia

```bash
# Ver logs de error
sudo tail -100 /var/log/mysqld.log

# Verificar configuración
sudo cat /etc/my.cnf.d/mysql-server.cnf

# Reiniciar servicio
sudo systemctl restart mysqld
```

### Problema: No se puede conectar remotamente

```bash
# Verificar bind-address
sudo grep bind-address /etc/my.cnf.d/mysql-server.cnf
# Debe mostrar: bind-address = 0.0.0.0

# Verificar firewall
sudo firewall-cmd --list-all | grep mysql

# Si no está, agregar:
sudo firewall-cmd --permanent --add-service=mysql
sudo firewall-cmd --reload

# Verificar permisos del usuario
mysql -u root -p -e "SELECT User, Host FROM mysql.user WHERE User='ecommerce_user';"
```

### Problema: Error de permisos

```bash
# Reconectar y otorgar permisos
mysql -u root -p

# En MySQL:
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'ecommerce_user'@'%';
```

### Problema: Tablas no se crean

```bash
# Verificar sintaxis
mysql -u root -p --verbose < 01_create_database.sql

# Ver errores específicos
mysql -u root -p
USE ecommerce;
SHOW WARNINGS;
```

---

## 📊 Información de Conexión

### Para el Middleware (Quarkus)

**Archivo: `application.properties`**
```properties
# MySQL Configuration
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=ecommerce_user
quarkus.datasource.password=<TU_CONTRASEÑA_AQUI>
quarkus.datasource.jdbc.url=jdbc:mysql://10.242.64.5:3306/ecommerce?useSSL=false&serverTimezone=America/Argentina/Buenos_Aires
quarkus.datasource.jdbc.max-size=16
quarkus.datasource.jdbc.min-size=2

# Hibernate Configuration
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=true
```

### Cadena de Conexión JDBC

```
jdbc:mysql://10.242.64.5:3306/ecommerce?useSSL=false&serverTimezone=America/Argentina/Buenos_Aires
```

### Credenciales

- **Host**: 10.242.64.5
- **Puerto**: 3306
- **Base de Datos**: ecommerce
- **Usuario**: ecommerce_user
- **Contraseña**: (la que configuraste en el paso 5)

---

## 🔐 Seguridad

### Cambiar Contraseñas

```sql
-- Cambiar contraseña de root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';

-- Cambiar contraseña de ecommerce_user
ALTER USER 'ecommerce_user'@'%' IDENTIFIED BY 'nueva_contraseña';

FLUSH PRIVILEGES;
```

### Backup de la Base de Datos

```bash
# Crear backup
mysqldump -u root -p ecommerce > backup_ecommerce_$(date +%Y%m%d_%H%M%S).sql

# Backup comprimido
mysqldump -u root -p ecommerce | gzip > backup_ecommerce_$(date +%Y%m%d).sql.gz

# Restaurar backup
mysql -u root -p ecommerce < backup_ecommerce_20260603_160000.sql
```

### Configurar Backups Automáticos

```bash
# Crear script de backup
sudo nano /usr/local/bin/backup_ecommerce.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mysqldump -u root -p'TU_CONTRASEÑA' ecommerce | gzip > $BACKUP_DIR/ecommerce_$DATE.sql.gz
# Mantener solo los últimos 7 días
find $BACKUP_DIR -name "ecommerce_*.sql.gz" -mtime +7 -delete
```

```bash
# Dar permisos
sudo chmod +x /usr/local/bin/backup_ecommerce.sh

# Agregar a crontab (backup diario a las 2 AM)
sudo crontab -e
# Agregar línea:
0 2 * * * /usr/local/bin/backup_ecommerce.sh
```

---

## 📝 Próximos Pasos

Una vez completada la instalación del backend:

### Parte 2: Middleware con Quarkus

1. Instalar Quarkus en servidor middleware
2. Crear proyecto Quarkus
3. Configurar conexión a MySQL
4. Crear entidades JPA
5. Implementar APIs REST
6. Configurar CORS
7. Documentar con OpenAPI

### Parte 3: Frontend con React

1. Crear proyecto React
2. Configurar conexión con APIs
3. Implementar componentes
4. Crear carrito de compras
5. Implementar checkout
6. Deploy de la aplicación

---

## 📞 Soporte

Para más información, consultar:
- [`README.md`](README.md) - Guía rápida
- [`PLAN.md`](PLAN.md) - Plan detallado con arquitectura
- [`SCRIPTS.md`](SCRIPTS.md) - Todos los scripts documentados

---

**Estado**: ✅ Backend MySQL Completo y Listo para Middleware  
**Fecha**: 2026-06-03  
**Versión**: 1.0.0