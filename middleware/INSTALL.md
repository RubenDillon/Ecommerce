# Guía de Instalación - Middleware Quarkus

## 📋 Requisitos Previos

### Hardware
- **Servidor**: 10.242.64.6
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Disco**: Mínimo 10GB libres
- **CPU**: 2 cores mínimo

### Software
- Red Hat Enterprise Linux 9
- Acceso SSH con sudo
- Conexión a internet

---

## 🚀 Paso 1: Instalar Java OpenJDK 17

```bash
# Conectar al servidor
ssh usuario@10.242.64.6

# Actualizar sistema
sudo dnf update -y

# Instalar OpenJDK 17 desde repositorios oficiales de Red Hat
sudo dnf install -y java-17-openjdk-devel

# Verificar instalación
java -version
# Debe mostrar: openjdk version "17.x.x"

# Configurar JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verificar JAVA_HOME
echo $JAVA_HOME
```

---

## 🔧 Paso 2: Instalar Maven

```bash
# Instalar Maven desde repositorios oficiales
sudo dnf install -y maven

# Verificar instalación
mvn -version
# Debe mostrar: Apache Maven 3.8.x o superior

# Configurar Maven settings (opcional)
mkdir -p ~/.m2
cat > ~/.m2/settings.xml << 'EOF'
<settings>
  <mirrors>
    <mirror>
      <id>central</id>
      <mirrorOf>central</mirrorOf>
      <url>https://repo.maven.apache.org/maven2</url>
    </mirror>
  </mirrors>
</settings>
EOF
```

---

## 📦 Paso 3: Preparar el Proyecto

### Opción A: Copiar desde máquina local

```bash
# En tu máquina local
cd /Users/rubendillon/Desktop/Ecommerce/middleware
scp -r ecommerce-api/ usuario@10.242.64.6:~/
```

### Opción B: Crear proyecto nuevo con Quarkus CLI

```bash
# En el servidor
cd ~

# Instalar Quarkus CLI
curl -Ls https://sh.jbang.dev | bash -s - trust add https://repo1.maven.org/maven2/io/quarkus/quarkus-cli/
curl -Ls https://sh.jbang.dev | bash -s - app install --fresh --force quarkus@quarkusio

# Crear proyecto
quarkus create app com.ecommerce:ecommerce-api \
    --extension='hibernate-orm-panache,jdbc-mysql,resteasy-reactive-jackson,smallrye-openapi,hibernate-validator,smallrye-health,micrometer-registry-prometheus'

cd ecommerce-api
```

---

## 🔌 Paso 4: Configurar Conexión a Base de Datos

```bash
cd ~/ecommerce-api

# Editar application.properties
nano src/main/resources/application.properties
```

Agregar/modificar:

```properties
# Database Configuration
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=ecommerce_user
quarkus.datasource.password=TU_CONTRASEÑA_AQUI
quarkus.datasource.jdbc.url=jdbc:mysql://10.242.64.5:3306/ecommerce?useSSL=false&serverTimezone=America/Argentina/Buenos_Aires
quarkus.datasource.jdbc.max-size=16
quarkus.datasource.jdbc.min-size=2

# Hibernate
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=false
quarkus.hibernate-orm.dialect=org.hibernate.dialect.MySQL8Dialect

# HTTP
quarkus.http.port=8080
quarkus.http.host=0.0.0.0

# CORS
quarkus.http.cors=true
quarkus.http.cors.origins=http://10.242.64.7:3000,http://localhost:3000
quarkus.http.cors.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
```

---

## 🧪 Paso 5: Probar Conexión a Base de Datos

```bash
# Probar conexión desde el servidor middleware
mysql -h 10.242.64.5 -u ecommerce_user -p

# En MySQL, verificar tablas
USE ecommerce;
SHOW TABLES;
SELECT COUNT(*) FROM Productos;
exit;
```

---

## 🏗️ Paso 6: Compilar el Proyecto

```bash
cd ~/ecommerce-api

# Compilar (primera vez puede tardar)
./mvnw clean package -DskipTests

# Si hay errores de permisos
chmod +x mvnw

# Compilar con tests
./mvnw clean package
```

**Salida esperada:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 2:30 min
```

---

## 🚀 Paso 7: Ejecutar en Modo Desarrollo

```bash
# Ejecutar en modo desarrollo (hot reload)
./mvnw quarkus:dev

# O con puerto específico
./mvnw quarkus:dev -Dquarkus.http.port=8080
```

**Salida esperada:**
```
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
INFO  [io.quarkus] (Quarkus Main Thread) ecommerce-api 1.0.0 on JVM started in 3.456s
INFO  [io.quarkus] (Quarkus Main Thread) Listening on: http://0.0.0.0:8080
```

---

## 🌐 Paso 8: Verificar APIs

### Desde el servidor

```bash
# Health check
curl http://localhost:8080/q/health

# Listar países
curl http://localhost:8080/api/paises

# Listar productos
curl http://localhost:8080/api/productos
```

### Desde tu máquina local

```bash
# Health check
curl http://10.242.64.6:8080/q/health

# Swagger UI
open http://10.242.64.6:8080/swagger-ui
```

---

## 🔥 Paso 9: Configurar Firewall

```bash
# Abrir puerto 8080
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Verificar
sudo firewall-cmd --list-ports
```

---

## 🎯 Paso 10: Ejecutar en Producción

### Opción A: Ejecutar JAR directamente

```bash
# Compilar para producción
./mvnw package -Dquarkus.profile=prod

# Ejecutar
java -jar target/quarkus-app/quarkus-run.jar
```

### Opción B: Crear servicio systemd

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/ecommerce-api.service
```

Contenido:

```ini
[Unit]
Description=E-commerce API Service
After=network.target mysql.service

[Service]
Type=simple
User=usuario
WorkingDirectory=/home/usuario/ecommerce-api
ExecStart=/usr/bin/java -jar /home/usuario/ecommerce-api/target/quarkus-app/quarkus-run.jar
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio
sudo systemctl enable ecommerce-api

# Iniciar servicio
sudo systemctl start ecommerce-api

# Verificar estado
sudo systemctl status ecommerce-api

# Ver logs
sudo journalctl -u ecommerce-api -f
```

---

## 📊 Paso 11: Verificar Endpoints

### Swagger UI
Abrir en navegador: http://10.242.64.6:8080/swagger-ui

### Probar APIs

```bash
# 1. Listar países
curl http://10.242.64.6:8080/api/paises

# 2. Listar productos disponibles
curl http://10.242.64.6:8080/api/productos/disponibles

# 3. Crear cliente
curl -X POST http://10.242.64.6:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "direccion": "Test Address 123",
    "idCiudad": 1,
    "idPais": 1,
    "telefono": "+54 11 1234-5678",
    "email": "test@example.com"
  }'

# 4. Crear orden
curl -X POST http://10.242.64.6:8080/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": 1,
    "items": [
      {"idProducto": 1001, "cantidad": 1}
    ]
  }'
```

---

## 🔍 Paso 12: Monitoreo

### Health Checks

```bash
# Health general
curl http://10.242.64.6:8080/q/health

# Liveness
curl http://10.242.64.6:8080/q/health/live

# Readiness
curl http://10.242.64.6:8080/q/health/ready
```

### Métricas Prometheus

```bash
curl http://10.242.64.6:8080/q/metrics
```

### Logs

```bash
# Ver logs del servicio
sudo journalctl -u ecommerce-api -f

# Ver logs de aplicación
tail -f ~/ecommerce-api/logs/application.log
```

---

## 🐛 Troubleshooting

### Problema: No compila el proyecto

```bash
# Limpiar cache de Maven
./mvnw clean

# Eliminar carpeta target
rm -rf target/

# Recompilar
./mvnw clean install -DskipTests
```

### Problema: No conecta con MySQL

```bash
# Verificar conectividad
telnet 10.242.64.5 3306

# Verificar credenciales
mysql -h 10.242.64.5 -u ecommerce_user -p

# Verificar configuración
cat src/main/resources/application.properties | grep datasource
```

### Problema: Puerto 8080 ocupado

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :8080

# Matar proceso
sudo kill -9 <PID>

# O cambiar puerto en application.properties
quarkus.http.port=8081
```

### Problema: Error de memoria

```bash
# Aumentar memoria heap
java -Xmx2g -jar target/quarkus-app/quarkus-run.jar

# O en systemd service
ExecStart=/usr/bin/java -Xmx2g -jar /home/usuario/ecommerce-api/target/quarkus-app/quarkus-run.jar
```

### Problema: CORS errors desde frontend

```bash
# Verificar configuración CORS
cat src/main/resources/application.properties | grep cors

# Debe incluir la IP del frontend
quarkus.http.cors.origins=http://10.242.64.7:3000
```

---

## 📈 Optimización

### Configuración de Producción

```properties
# En application.properties, perfil prod
%prod.quarkus.log.level=INFO
%prod.quarkus.hibernate-orm.log.sql=false
%prod.quarkus.log.console.json=true
%prod.quarkus.datasource.jdbc.max-size=32
```

### Tuning de JVM

```bash
java -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -Xmx2g \
     -Xms1g \
     -jar target/quarkus-app/quarkus-run.jar
```

---

## 🔐 Seguridad

### Cambiar contraseña de base de datos

```bash
# Editar application.properties
nano src/main/resources/application.properties

# Cambiar línea
quarkus.datasource.password=NUEVA_CONTRASEÑA

# Recompilar y reiniciar
./mvnw clean package
sudo systemctl restart ecommerce-api
```

### Configurar HTTPS (opcional)

```properties
quarkus.http.ssl-port=8443
quarkus.http.ssl.certificate.key-store-file=keystore.jks
quarkus.http.ssl.certificate.key-store-password=password
```

---

## 📦 Backup

```bash
# Backup del proyecto
tar -czf ecommerce-api-backup-$(date +%Y%m%d).tar.gz ~/ecommerce-api/

# Backup de configuración
cp src/main/resources/application.properties application.properties.backup
```

---

## ✅ Checklist de Instalación

- [ ] Java 17 instalado y configurado
- [ ] Maven instalado
- [ ] Proyecto copiado/creado
- [ ] application.properties configurado
- [ ] Conexión a MySQL verificada
- [ ] Proyecto compilado exitosamente
- [ ] Aplicación ejecutándose
- [ ] Firewall configurado
- [ ] APIs respondiendo correctamente
- [ ] Swagger UI accesible
- [ ] Health checks funcionando
- [ ] Servicio systemd configurado (producción)
- [ ] Logs configurados
- [ ] Monitoreo activo

---

## 🔄 Próximos Pasos

Una vez completada la instalación del middleware:

1. **Verificar integración con backend**: Todas las APIs deben poder consultar la base de datos
2. **Preparar para frontend**: El frontend React se conectará a estas APIs
3. **Configurar monitoreo**: Implementar alertas y dashboards
4. **Documentar APIs**: Completar documentación en Swagger

---

## 📞 Soporte

Para más información:
- [`README.md`](README.md) - Documentación general
- [`PLAN.md`](PLAN.md) - Arquitectura detallada
- [`CODIGO_COMPLETO.md`](CODIGO_COMPLETO.md) - Código fuente completo

---

**Estado**: ✅ Guía Completa  
**Versión**: 1.0.0  
**Última actualización**: 2026-06-03