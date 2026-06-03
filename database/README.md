# Backend E-commerce - MySQL Database

## 📋 Resumen Ejecutivo

Este directorio contiene todos los scripts y documentación necesarios para implementar la **Parte 1** del sistema de e-commerce de 3 capas: el **Backend de Base de Datos MySQL**.

### Servidor Backend
- **IP**: 10.242.64.5
- **Sistema Operativo**: Red Hat Enterprise Linux 9
- **Base de Datos**: MySQL (última versión estable desde repositorios oficiales de Red Hat)
- **Acceso**: SSH con usuario sudo

---

## 📁 Estructura de Archivos

```
Ecommerce/database/
├── README.md                    # Este archivo
├── PLAN.md                      # Plan detallado con arquitectura y diagramas
├── SCRIPTS.md                   # Todos los scripts de implementación
└── 02_seed_data.sql            # (Vacío - se reemplazará con scripts del SCRIPTS.md)
```

---

## 🚀 Guía de Implementación Rápida

### Paso 1: Preparar los Scripts

Desde tu máquina local, copia los scripts al servidor:

```bash
# Crear los archivos de script desde SCRIPTS.md
cd Ecommerce/database/

# Crear script de instalación
cat > install_mysql.sh << 'EOF'
[Copiar contenido de SCRIPTS.md sección 1]
EOF

# Crear script de configuración
cat > configure_mysql.sh << 'EOF'
[Copiar contenido de SCRIPTS.md sección 2]
EOF

# Crear scripts SQL
cat > 01_create_database.sql << 'EOF'
[Copiar contenido de SCRIPTS.md sección 3]
EOF

cat > 02_seed_data_part1.sql << 'EOF'
[Copiar contenido de SCRIPTS.md sección 4]
EOF

cat > 02_seed_data_part2.sql << 'EOF'
[Copiar contenido de SCRIPTS.md sección 5]
EOF

cat > 02_seed_data_part3.sql << 'EOF'
[Copiar contenido de SCRIPTS.md sección 6]
EOF

cat > 04_test_queries.sql << 'EOF'
[Copiar contenido de SCRIPTS.md sección 7]
EOF

cat > test_connection.sh << 'EOF'
[Copiar contenido de SCRIPTS.md sección 8]
EOF

# Dar permisos de ejecución
chmod +x *.sh
```

### Paso 2: Copiar al Servidor

```bash
# Copiar todos los archivos al servidor
scp -r ../database/ usuario@10.242.64.5:~/ecommerce/
```

### Paso 3: Instalación en el Servidor

```bash
# Conectar al servidor
ssh usuario@10.242.64.5

# Ir al directorio
cd ~/ecommerce/database/

# 1. Instalar MySQL
sudo ./install_mysql.sh

# 2. Configurar seguridad de MySQL
sudo mysql_secure_installation
# Responder:
# - Set root password? [Y/n] Y
# - Remove anonymous users? [Y/n] Y
# - Disallow root login remotely? [Y/n] Y
# - Remove test database? [Y/n] Y
# - Reload privilege tables? [Y/n] Y

# 3. Configurar acceso remoto
sudo ./configure_mysql.sh
# Ingresar contraseña root de MySQL
# Ingresar contraseña para ecommerce_user (guardar esta contraseña!)

# 4. Crear base de datos y estructura
mysql -u root -p < 01_create_database.sql

# 5. Cargar datos iniciales
mysql -u root -p < 02_seed_data_part1.sql
mysql -u root -p < 02_seed_data_part2.sql
mysql -u root -p < 02_seed_data_part3.sql

# 6. Ejecutar pruebas de validación
mysql -u root -p < 04_test_queries.sql
```

### Paso 4: Verificar desde el Middleware

```bash
# Desde el servidor del middleware, probar conexión
./test_connection.sh
```

---

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

1. **Pais** (5 registros)
   - Argentina, Chile, Uruguay, Paraguay, Brasil

2. **Ciudades** (50 registros)
   - 10 ciudades principales por país

3. **Clientes**
   - Información completa de clientes
   - Relacionado con País y Ciudad

4. **Clases** (20 categorías)
   - Tipos de productos disponibles

5. **Productos** (50 productos iniciales)
   - Catálogo completo con imágenes (URLs)
   - Precios basados en mercado argentino

6. **Ordenes**
   - Órdenes de compra de clientes

7. **Items**
   - Detalle de productos en cada orden

### Diagrama de Relaciones

Ver [`PLAN.md`](PLAN.md:1) para el diagrama completo en formato Mermaid.

---

## 🔒 Seguridad y Acceso

### Credenciales

**Usuario Root MySQL**:
- Usuario: `root`
- Contraseña: (definida durante mysql_secure_installation)
- Acceso: Solo local

**Usuario de Aplicación**:
- Usuario: `ecommerce_user`
- Contraseña: (definida durante configure_mysql.sh)
- Acceso: Remoto desde cualquier IP (%)
- Permisos: Solo sobre base de datos `ecommerce`

### Firewall

El puerto 3306 (MySQL) está abierto para conexiones remotas.

```bash
# Verificar reglas de firewall
sudo firewall-cmd --list-all
```

---

## 📊 Datos Iniciales Cargados

### Resumen de Datos

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| Pais | 5 | Argentina, Chile, Uruguay, Paraguay, Brasil |
| Ciudades | 50 | 10 ciudades por país |
| Clases | 20 | Categorías de productos |
| Productos | 50 | Productos con imágenes y precios |
| Clientes | 0 | Se crearán desde la aplicación |
| Ordenes | 0 | Se crearán desde la aplicación |
| Items | 0 | Se crearán desde la aplicación |

### Ejemplos de Productos

**Electrónica**: PlayStation 5, Nintendo Switch, iPhone 15 Pro, Samsung Galaxy S24, iPad Air

**Indumentaria**: Nike Air Max, Reebok Classic, Remera Adidas, Jean Levis, Campera North Face

**Electrodomésticos**: Heladera Samsung, Lavarropas LG, Microondas, Aire Acondicionado, Aspiradora Robot

**Belleza**: Set Makeup MAC, Perfume Chanel, Crema La Roche-Posay, Shampoo Kerastase, Serum Vitamina C

*(Ver [`SCRIPTS.md`](SCRIPTS.md:1) sección 6 para la lista completa de 50 productos)*

---

## 🔗 Información de Conexión para Middleware

### Configuración JDBC (Quarkus)

```properties
# application.properties
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=ecommerce_user
quarkus.datasource.password=<contraseña_definida>
quarkus.datasource.jdbc.url=jdbc:mysql://10.242.64.5:3306/ecommerce?useSSL=false&serverTimezone=America/Argentina/Buenos_Aires
quarkus.datasource.jdbc.max-size=16
```

### Endpoints Sugeridos para el Middleware

#### Países y Ciudades
- `GET /api/paises` - Listar todos los países
- `GET /api/ciudades?idPais={id}` - Listar ciudades por país

#### Clientes
- `GET /api/clientes` - Listar todos los clientes
- `GET /api/clientes/{id}` - Obtener cliente por ID
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente

#### Productos
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos?idTipo={id}` - Filtrar por categoría
- `GET /api/clases` - Listar categorías

#### Órdenes
- `GET /api/ordenes` - Listar todas las órdenes
- `GET /api/ordenes/{id}` - Obtener orden por ID
- `GET /api/ordenes?idCliente={id}` - Órdenes de un cliente
- `POST /api/ordenes` - Crear nueva orden
- `POST /api/ordenes/{id}/items` - Agregar items a orden

---

## ✅ Validaciones Implementadas

### Integridad Referencial

1. **No se puede eliminar un País** si tiene:
   - Ciudades asociadas
   - Clientes asociados

2. **No se puede eliminar una Ciudad** si tiene:
   - Clientes asociados

3. **No se puede eliminar una Clase** si tiene:
   - Productos asociados

4. **No se puede eliminar un Producto** si está en:
   - Items de órdenes

5. **Al eliminar un Cliente**:
   - Se eliminan en cascada sus órdenes
   - Se eliminan en cascada los items de esas órdenes

6. **Al eliminar una Orden**:
   - Se eliminan en cascada sus items

### Validaciones de Datos

- Stock no puede ser negativo
- Precios (costo y venta) deben ser positivos
- Cantidad en items debe ser mayor a 0
- SKU debe ser único
- Email debe tener formato válido (validación a nivel aplicación)

---

## 🧪 Pruebas y Validación

### Ejecutar Pruebas

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar script de pruebas
source 04_test_queries.sql
```

### Pruebas Incluidas

1. ✓ Verificación de estructura de tablas
2. ✓ Conteo de datos iniciales
3. ✓ Verificación de foreign keys
4. ✓ Inserción de cliente de prueba
5. ✓ Creación de orden de prueba
6. ✓ Validación de restricciones DELETE
7. ✓ Consultas útiles para middleware
8. ✓ Estadísticas generales

---

## 🔧 Comandos Útiles

### Administración de MySQL

```bash
# Ver estado del servicio
sudo systemctl status mysqld

# Reiniciar MySQL
sudo systemctl restart mysqld

# Ver logs
sudo tail -f /var/log/mysqld.log

# Conectar a MySQL
mysql -u root -p
mysql -u ecommerce_user -p -h 10.242.64.5
```

### Backup y Restauración

```bash
# Crear backup
mysqldump -u root -p ecommerce > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
mysql -u root -p ecommerce < backup_20260603_160000.sql

# Backup comprimido
mysqldump -u root -p ecommerce | gzip > backup_$(date +%Y%m%d).sql.gz

# Restaurar backup comprimido
gunzip < backup_20260603.sql.gz | mysql -u root -p ecommerce
```

### Consultas Útiles

```sql
-- Ver todas las tablas
USE ecommerce;
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE Productos;

-- Contar registros
SELECT COUNT(*) FROM Productos;

-- Ver productos por categoría
SELECT c.Nombre, COUNT(p.IdProducto) AS Total
FROM Clases c
LEFT JOIN Productos p ON c.IdTipo = p.IdTipo
GROUP BY c.IdTipo, c.Nombre;

-- Ver valor total del inventario
SELECT 
    SUM(Valor_costo * Stock) AS Costo_Total,
    SUM(Valor_venta * Stock) AS Venta_Total
FROM Productos;
```

---

## 📈 Monitoreo y Performance

### Índices Creados

Todos los campos que son foreign keys tienen índices para optimizar las consultas:
- `idx_nombre_pais`, `idx_ciudad`, `idx_nombre_cliente`
- `idx_email_cliente`, `idx_nombre_producto`, `idx_sku`
- Y más...

### Recomendaciones de Performance

1. **Monitorear queries lentas**:
```sql
-- Habilitar slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

2. **Analizar uso de índices**:
```sql
EXPLAIN SELECT * FROM Productos WHERE IdTipo = 1;
```

3. **Optimizar tablas periódicamente**:
```sql
OPTIMIZE TABLE Productos;
```

---

## 🚨 Troubleshooting

### Problema: No se puede conectar remotamente

**Solución**:
```bash
# 1. Verificar que MySQL escucha en todas las interfaces
sudo grep bind-address /etc/my.cnf.d/mysql-server.cnf
# Debe mostrar: bind-address = 0.0.0.0

# 2. Verificar firewall
sudo firewall-cmd --list-all | grep mysql

# 3. Verificar permisos del usuario
mysql -u root -p -e "SELECT User, Host FROM mysql.user WHERE User='ecommerce_user';"
```

### Problema: Error de permisos

**Solución**:
```sql
-- Otorgar permisos nuevamente
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;
```

### Problema: Tablas no se crean

**Solución**:
```bash
# Verificar logs de MySQL
sudo tail -100 /var/log/mysqld.log

# Verificar sintaxis del script
mysql -u root -p --verbose < 01_create_database.sql
```

---

## 📝 Próximos Pasos

### Parte 2: Middleware con Quarkus

Una vez completado el backend, proceder con:

1. **Instalación de Quarkus** en servidor middleware
2. **Creación de entidades JPA** para todas las tablas
3. **Implementación de APIs REST** para CRUD
4. **Configuración de CORS** para frontend
5. **Validaciones de negocio**
6. **Manejo de transacciones**
7. **Documentación con OpenAPI/Swagger**

### Parte 3: Frontend con React

Finalmente, implementar:

1. **Interfaz de usuario** para catálogo de productos
2. **Carrito de compras**
3. **Gestión de clientes**
4. **Proceso de checkout**
5. **Historial de órdenes**
6. **Panel de administración**

---

## 📞 Soporte y Documentación

### Documentos Disponibles

- [`PLAN.md`](PLAN.md:1) - Plan detallado con arquitectura y diagramas
- [`SCRIPTS.md`](SCRIPTS.md:1) - Todos los scripts de implementación
- `README.md` - Este archivo (guía rápida)

### Recursos Adicionales

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Red Hat MySQL Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9)
- [Quarkus Guides](https://quarkus.io/guides/)
- [React Documentation](https://react.dev/)

---

## ✨ Características Implementadas

- ✅ Base de datos MySQL instalada desde repositorios oficiales de Red Hat
- ✅ 7 tablas con relaciones y constraints
- ✅ 5 países con 50 ciudades
- ✅ 20 categorías de productos
- ✅ 50 productos con imágenes y precios reales
- ✅ Integridad referencial completa
- ✅ Índices para optimización
- ✅ Usuario de aplicación con permisos limitados
- ✅ Acceso remoto configurado
- ✅ Scripts de prueba y validación
- ✅ Documentación completa

---

## 📄 Licencia

Este proyecto es parte de una aplicación de e-commerce de 3 capas para uso educativo/comercial.

---

**Última actualización**: 2026-06-03  
**Versión**: 1.0.0  
**Estado**: ✅ Backend Completo - Listo para Middleware