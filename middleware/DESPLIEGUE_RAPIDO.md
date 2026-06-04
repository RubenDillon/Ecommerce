# 🚀 Guía Rápida de Despliegue - Middleware Corregido

## 📋 Resumen de Cambios

Se corrigieron errores en los archivos Resource (Controllers REST) para que coincidan con los métodos de los Services.

### Archivos Modificados:
- ✅ `CiudadResource.java`
- ✅ `ClienteResource.java`
- ✅ `ProductoResource.java`
- ✅ `OrdenResource.java`

---

## 🔄 Paso 1: Traer los Cambios al Servidor

### Opción A: Usando Git (Recomendado)

```bash
# Conectar al servidor middleware
ssh usuario@10.242.64.6

# Ir al directorio del proyecto
cd ~/ecommerce-api

# Hacer backup del código actual
cp -r src src.backup.$(date +%Y%m%d_%H%M%S)

# Traer los cambios desde Git
git pull origin main

# O si no tienes Git configurado, clonar de nuevo
cd ~
mv ecommerce-api ecommerce-api.old
git clone https://github.com/RubenDillon/Ecommerce.git
cd Ecommerce/middleware/ecommerce-api
```

### Opción B: Copiar desde tu Mac

```bash
# En tu Mac (Terminal local)
cd /Users/rubendillon/Desktop/Ecommerce/middleware

# Copiar solo los archivos modificados
scp ecommerce-api/src/main/java/com/ecommerce/resource/CiudadResource.java \
    usuario@10.242.64.6:~/ecommerce-api/src/main/java/com/ecommerce/resource/

scp ecommerce-api/src/main/java/com/ecommerce/resource/ClienteResource.java \
    usuario@10.242.64.6:~/ecommerce-api/src/main/java/com/ecommerce/resource/

scp ecommerce-api/src/main/java/com/ecommerce/resource/ProductoResource.java \
    usuario@10.242.64.6:~/ecommerce-api/src/main/java/com/ecommerce/resource/

scp ecommerce-api/src/main/java/com/ecommerce/resource/OrdenResource.java \
    usuario@10.242.64.6:~/ecommerce-api/src/main/java/com/ecommerce/resource/
```

### Opción C: Copiar todo el proyecto

```bash
# En tu Mac
cd /Users/rubendillon/Desktop/Ecommerce/middleware

# Comprimir el proyecto
tar -czf ecommerce-api.tar.gz ecommerce-api/

# Copiar al servidor
scp ecommerce-api.tar.gz usuario@10.242.64.6:~/

# En el servidor
ssh usuario@10.242.64.6
cd ~
tar -xzf ecommerce-api.tar.gz
```

---

## 🏗️ Paso 2: Compilar el Proyecto

```bash
# En el servidor
cd ~/ecommerce-api

# Limpiar compilaciones anteriores
./mvnw clean

# Compilar (sin tests para ser más rápido)
./mvnw package -DskipTests

# Si quieres ejecutar los tests
./mvnw package
```

**Salida esperada:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 2-3 min
```

---

## 🚀 Paso 3: Ejecutar la API

### Opción A: Modo Desarrollo (con hot-reload)

```bash
# Ejecutar en modo desarrollo
./mvnw quarkus:dev

# La aplicación estará disponible en:
# http://10.242.64.6:8080
```

### Opción B: Modo Producción (JAR)

```bash
# Ejecutar el JAR compilado
java -jar target/quarkus-app/quarkus-run.jar

# Con configuración de memoria
java -Xmx2g -jar target/quarkus-app/quarkus-run.jar
```

### Opción C: Como Servicio Systemd (Recomendado para Producción)

```bash
# Si ya existe el servicio, reiniciarlo
sudo systemctl restart ecommerce-api

# Ver el estado
sudo systemctl status ecommerce-api

# Ver logs en tiempo real
sudo journalctl -u ecommerce-api -f
```

---

## ✅ Paso 4: Verificar que Funciona

### 1. Health Check

```bash
# Desde el servidor
curl http://localhost:8080/q/health

# Desde tu Mac
curl http://10.242.64.6:8080/q/health
```

**Respuesta esperada:**
```json
{
  "status": "UP",
  "checks": []
}
```

### 2. Probar Endpoints Corregidos

```bash
# 1. Listar países
curl http://10.242.64.6:8080/api/paises

# 2. Listar ciudades por país (CORREGIDO)
curl http://10.242.64.6:8080/api/ciudades/pais/1

# 3. Listar clientes por país (CORREGIDO)
curl http://10.242.64.6:8080/api/clientes/pais/1

# 4. Listar clientes por ciudad (CORREGIDO)
curl http://10.242.64.6:8080/api/clientes/ciudad/1

# 5. Listar productos por clase (CORREGIDO)
curl http://10.242.64.6:8080/api/productos/clase/1

# 6. Buscar producto por SKU (CORREGIDO - ahora usa Integer)
curl http://10.242.64.6:8080/api/productos/sku/1001

# 7. Listar productos disponibles
curl http://10.242.64.6:8080/api/productos/disponibles

# 8. Listar órdenes de un cliente (CORREGIDO)
curl http://10.242.64.6:8080/api/ordenes/cliente/1

# 9. Ver items de una orden (CORREGIDO)
curl http://10.242.64.6:8080/api/ordenes/1/items
```

### 3. Crear una Orden (Endpoint Corregido)

```bash
curl -X POST http://10.242.64.6:8080/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": 1,
    "items": [
      {
        "idProducto": 1001,
        "cantidad": 2
      },
      {
        "idProducto": 1002,
        "cantidad": 1
      }
    ]
  }'
```

### 4. Swagger UI

Abrir en el navegador:
```
http://10.242.64.6:8080/swagger-ui
```

---

## 🔍 Paso 5: Verificar Logs

```bash
# Ver logs de la aplicación
sudo journalctl -u ecommerce-api -f

# O si ejecutaste manualmente
tail -f ~/ecommerce-api/logs/application.log
```

**Buscar estas líneas:**
```
INFO  [io.quarkus] (Quarkus Main Thread) ecommerce-api 1.0.0 on JVM started
INFO  [io.quarkus] (Quarkus Main Thread) Listening on: http://0.0.0.0:8080
```

---

## 🐛 Troubleshooting

### Problema: "Port 8080 already in use"

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :8080

# Matar el proceso anterior
sudo kill -9 <PID>

# O detener el servicio
sudo systemctl stop ecommerce-api
```

### Problema: "Cannot connect to database"

```bash
# Verificar conexión a MySQL
mysql -h 10.242.64.5 -u ecommerce_user -p

# Verificar configuración
cat src/main/resources/application.properties | grep datasource
```

### Problema: "BUILD FAILURE"

```bash
# Limpiar todo y recompilar
./mvnw clean
rm -rf target/
./mvnw clean install -DskipTests
```

### Problema: Errores de compilación de MapStruct

```bash
# Verificar que los DTOs tengan todos los campos
ls -la src/main/java/com/ecommerce/dto/

# Recompilar con limpieza profunda
./mvnw clean compile -U
```

---

## 📊 Endpoints Disponibles

### Países
- `GET /api/paises` - Listar todos
- `GET /api/paises/{id}` - Obtener por ID
- `POST /api/paises` - Crear
- `PUT /api/paises/{id}` - Actualizar
- `DELETE /api/paises/{id}` - Eliminar

### Ciudades
- `GET /api/ciudades` - Listar todas
- `GET /api/ciudades/{id}` - Obtener por ID
- `GET /api/ciudades/pais/{idPais}` - Por país ✅ CORREGIDO
- `POST /api/ciudades` - Crear
- `PUT /api/ciudades/{id}` - Actualizar
- `DELETE /api/ciudades/{id}` - Eliminar

### Clientes
- `GET /api/clientes` - Listar todos
- `GET /api/clientes/{id}` - Obtener por ID
- `GET /api/clientes/search?q={email}` - Buscar por email ✅ CORREGIDO
- `GET /api/clientes/pais/{idPais}` - Por país ✅ CORREGIDO
- `GET /api/clientes/ciudad/{idCiudad}` - Por ciudad ✅ CORREGIDO
- `POST /api/clientes` - Crear
- `PUT /api/clientes/{id}` - Actualizar
- `DELETE /api/clientes/{id}` - Eliminar

### Clases
- `GET /api/clases` - Listar todas
- `GET /api/clases/{id}` - Obtener por ID
- `POST /api/clases` - Crear
- `PUT /api/clases/{id}` - Actualizar
- `DELETE /api/clases/{id}` - Eliminar

### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/{id}` - Obtener por ID
- `GET /api/productos/clase/{idTipo}` - Por clase ✅ CORREGIDO
- `GET /api/productos/sku/{sku}` - Por SKU (Integer) ✅ CORREGIDO
- `GET /api/productos/disponibles` - Con stock
- `POST /api/productos` - Crear
- `PUT /api/productos/{id}` - Actualizar
- `DELETE /api/productos/{id}` - Eliminar
- `PATCH /api/productos/{id}/stock` - Actualizar stock

### Órdenes
- `GET /api/ordenes` - Listar todas
- `GET /api/ordenes/{id}` - Obtener por ID
- `GET /api/ordenes/cliente/{idCliente}` - Por cliente ✅ CORREGIDO
- `GET /api/ordenes/{id}/items` - Items de orden ✅ CORREGIDO
- `POST /api/ordenes` - Crear (usa CrearOrdenDTO) ✅ CORREGIDO
- `DELETE /api/ordenes/{id}` - Eliminar

---

## 🎯 Integración con Frontend

Una vez que el middleware esté funcionando:

```bash
# El frontend React se conectará a:
http://10.242.64.6:8080/api/*

# Verificar CORS en application.properties:
quarkus.http.cors.origins=http://10.242.64.7:3000
```

---

## 📝 Checklist de Despliegue

- [ ] Código copiado al servidor
- [ ] Proyecto compilado sin errores
- [ ] Aplicación ejecutándose
- [ ] Health check responde OK
- [ ] Endpoints corregidos funcionan
- [ ] Swagger UI accesible
- [ ] Base de datos conectada
- [ ] CORS configurado para frontend
- [ ] Logs sin errores
- [ ] Servicio systemd activo (producción)

---

## 📞 Soporte

**Archivos de referencia:**
- `INSTALL.md` - Instalación completa desde cero
- `INSTRUCCIONES_COMPILACION.md` - Solución de problemas de compilación
- `README.md` - Documentación general
- `CODIGO_COMPLETO.md` - Código fuente completo (Parte 1)
- `CODIGO_COMPLETO_PARTE2.md` - Servicios
- `CODIGO_COMPLETO_PARTE3.md` - Resources (Controllers)

---

**Estado**: ✅ Listo para Despliegue  
**Versión**: 1.0.1 (Corregida)  
**Fecha**: 2026-06-04