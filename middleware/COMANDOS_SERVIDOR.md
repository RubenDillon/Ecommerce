# 🚀 Comandos para Subir y Desplegar el Middleware

## PARTE 1: Subir Cambios a GitHub (Desde tu Mac)

```bash
# 1. Ir al directorio del proyecto
cd /Users/rubendillon/Desktop/Ecommerce

# 2. Ver qué archivos cambiaron
git status

# 3. Agregar todos los cambios
git add .

# 4. Hacer commit con mensaje descriptivo
git commit -m "Fix: Corregidos métodos en Resources (CiudadResource, ClienteResource, ProductoResource, OrdenResource)"

# 5. Subir a GitHub
git push origin main
```

**Espera a que termine de subir. Verás algo como:**
```
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Writing objects: 100% (8/8), 2.5 KiB | 2.5 MiB/s, done.
Total 8 (delta 5), reused 0 (delta 0)
To https://github.com/RubenDillon/Ecommerce.git
   abc1234..def5678  main -> main
```

---

## PARTE 2: Desplegar en el Servidor (10.242.64.6)

### PASO 1: Conectar al Servidor

```bash
ssh usuario@10.242.64.6
```

---

### PASO 2: Clonar/Actualizar desde GitHub

#### Si es la PRIMERA VEZ (no tienes el repositorio):

```bash
# Ir al home
cd ~

# Clonar el repositorio
git clone https://github.com/RubenDillon/Ecommerce.git

# Ir al directorio del middleware
cd Ecommerce/middleware/ecommerce-api
```

#### Si YA TIENES el repositorio (actualizar):

```bash
# Ir al directorio
cd ~/Ecommerce

# Hacer backup por si acaso
cp -r middleware/ecommerce-api middleware/ecommerce-api.backup.$(date +%Y%m%d_%H%M%S)

# Traer los últimos cambios
git pull origin main

# Ir al directorio del middleware
cd middleware/ecommerce-api
```

---

### PASO 3: Compilar

```bash
# Asegurarse de estar en el directorio correcto
cd ~/Ecommerce/middleware/ecommerce-api

# Dar permisos de ejecución al wrapper de Maven
chmod +x mvnw

# Compilar (sin tests para ser más rápido)
./mvnw clean package -DskipTests
```

**Espera 2-3 minutos. Debe terminar con:**
```
[INFO] BUILD SUCCESS
```

---

### PASO 4: Levantar la API

#### Opción A: Modo Desarrollo (Recomendado para pruebas)

```bash
# Ejecutar en modo desarrollo
./mvnw quarkus:dev
```

**Verás algo como:**
```
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
INFO  [io.quarkus] ecommerce-api 1.0.0 started in 3.456s
INFO  [io.quarkus] Listening on: http://0.0.0.0:8080
```

**La API está corriendo! 🎉**

Para detenerla: `Ctrl + C`

#### Opción B: Modo Producción (Como servicio en background)

```bash
# Ejecutar el JAR en background
nohup java -jar target/quarkus-app/quarkus-run.jar > app.log 2>&1 &

# Ver el proceso
ps aux | grep quarkus

# Ver los logs
tail -f app.log
```

Para detenerla:
```bash
# Buscar el PID
ps aux | grep quarkus

# Matar el proceso (reemplaza <PID> con el número)
kill <PID>
```

---

### PASO 5: Verificar que Funciona

#### Desde el MISMO servidor:

```bash
# Health check
curl http://localhost:8080/q/health

# Listar países
curl http://localhost:8080/api/paises

# Listar productos
curl http://localhost:8080/api/productos
```

#### Desde tu MAC (otra terminal):

```bash
# Health check
curl http://10.242.64.6:8080/q/health

# Listar países
curl http://10.242.64.6:8080/api/paises

# Swagger UI - abrir en navegador
open http://10.242.64.6:8080/swagger-ui
```

---

## 🔥 RESUMEN COMPLETO (Copy-Paste)

### En tu Mac (Terminal local):

```bash
# Subir cambios a GitHub
cd /Users/rubendillon/Desktop/Ecommerce
git add .
git commit -m "Fix: Corregidos métodos en Resources"
git push origin main
```

### En el Servidor (SSH):

```bash
# Conectar
ssh usuario@10.242.64.6

# Actualizar código
cd ~/Ecommerce
git pull origin main
cd middleware/ecommerce-api

# Compilar
./mvnw clean package -DskipTests

# Ejecutar
./mvnw quarkus:dev

# Verificar (en otra terminal SSH)
curl http://localhost:8080/q/health
```

---

## ⚠️ Si algo falla

### Error: "mvn: command not found"

```bash
# Instalar Maven
sudo dnf install -y maven

# Verificar
mvn -version
```

### Error: "java: command not found"

```bash
# Instalar Java 17
sudo dnf install -y java-17-openjdk-devel

# Verificar
java -version
```

### Error: "Port 8080 already in use"

```bash
# Ver qué está usando el puerto
sudo lsof -i :8080

# Matar el proceso (reemplaza <PID>)
sudo kill -9 <PID>
```

### Error: "Cannot connect to database"

```bash
# Verificar conexión a MySQL
mysql -h 10.242.64.5 -u ecommerce_user -p

# Si no funciona, revisar application.properties
nano src/main/resources/application.properties
```

### Error de compilación

```bash
# Limpiar todo
./mvnw clean
rm -rf target/

# Recompilar
./mvnw clean install -DskipTests
```

---

## 📊 URLs Importantes

Una vez que la API esté corriendo:

- **API Base**: http://10.242.64.6:8080/api/
- **Swagger UI**: http://10.242.64.6:8080/swagger-ui
- **Health Check**: http://10.242.64.6:8080/q/health
- **Metrics**: http://10.242.64.6:8080/q/metrics

---

## 🎯 Endpoints Principales

```bash
# Países
curl http://10.242.64.6:8080/api/paises

# Ciudades
curl http://10.242.64.6:8080/api/ciudades

# Clientes
curl http://10.242.64.6:8080/api/clientes

# Productos
curl http://10.242.64.6:8080/api/productos

# Clases
curl http://10.242.64.6:8080/api/clases

# Órdenes
curl http://10.242.64.6:8080/api/ordenes
```

---

## 🔄 Para Actualizar en el Futuro

Cada vez que hagas cambios:

### 1. En tu Mac:
```bash
cd /Users/rubendillon/Desktop/Ecommerce
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### 2. En el Servidor:
```bash
ssh usuario@10.242.64.6
cd ~/Ecommerce
git pull origin main
cd middleware/ecommerce-api
./mvnw clean package -DskipTests
./mvnw quarkus:dev
```

---

## ✅ Checklist

- [ ] Cambios subidos a GitHub desde tu Mac
- [ ] Conectado al servidor 10.242.64.6
- [ ] Código actualizado con git pull
- [ ] Proyecto compilado sin errores
- [ ] API ejecutándose
- [ ] Health check responde OK
- [ ] Endpoints funcionan
- [ ] Swagger UI accesible

---

**¡Listo! Tu middleware está corriendo y exponiendo las APIs 🚀**