# Middleware E-commerce API - Quarkus

## 📋 Resumen Ejecutivo

Este es el **middleware** de la aplicación de e-commerce de 3 capas, implementado con **Quarkus** y **Java 17**. Proporciona APIs REST para gestionar todas las operaciones del sistema.

### Servidor Middleware
- **IP**: 10.242.64.6
- **Puerto**: 8080
- **SO**: Red Hat Enterprise Linux 9
- **Framework**: Quarkus 3.6.4
- **Java**: OpenJDK 17 LTS

---

## 🏗️ Arquitectura

```
Frontend (React)          Middleware (Quarkus)         Backend (MySQL)
10.242.64.7:3000    →    10.242.64.6:8080      →     10.242.64.5:3306
```

### Capas del Middleware

1. **Resources (Controllers)** - Endpoints REST
2. **Services** - Lógica de negocio
3. **Repositories** - Acceso a datos (Panache)
4. **Entities** - Modelos JPA
5. **DTOs** - Transferencia de datos
6. **Mappers** - Conversión Entity ↔ DTO

---

## 📡 APIs REST Disponibles

### Países
- `GET /api/paises` - Listar todos
- `GET /api/paises/{id}` - Obtener por ID
- `POST /api/paises` - Crear
- `PUT /api/paises/{id}` - Actualizar
- `DELETE /api/paises/{id}` - Eliminar

### Ciudades
- `GET /api/ciudades` - Listar todas
- `GET /api/ciudades/{id}` - Obtener por ID
- `GET /api/ciudades/pais/{idPais}` - Por país
- `POST /api/ciudades` - Crear
- `PUT /api/ciudades/{id}` - Actualizar
- `DELETE /api/ciudades/{id}` - Eliminar

### Clientes
- `GET /api/clientes` - Listar todos
- `GET /api/clientes/{id}` - Obtener por ID
- `GET /api/clientes/email/{email}` - Por email
- `GET /api/clientes/pais/{idPais}` - Por país
- `POST /api/clientes` - Crear
- `PUT /api/clientes/{id}` - Actualizar
- `DELETE /api/clientes/{id}` - Eliminar

### Clases (Categorías)
- `GET /api/clases` - Listar todas
- `GET /api/clases/{id}` - Obtener por ID
- `POST /api/clases` - Crear
- `PUT /api/clases/{id}` - Actualizar
- `DELETE /api/clases/{id}` - Eliminar

### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/{id}` - Obtener por ID
- `GET /api/productos/sku/{sku}` - Por SKU
- `GET /api/productos/clase/{idTipo}` - Por categoría
- `GET /api/productos/disponibles` - Con stock
- `POST /api/productos` - Crear
- `PUT /api/productos/{id}` - Actualizar
- `PATCH /api/productos/{id}/stock` - Actualizar stock
- `DELETE /api/productos/{id}` - Eliminar

### Órdenes
- `GET /api/ordenes` - Listar todas
- `GET /api/ordenes/{id}` - Obtener por ID
- `GET /api/ordenes/cliente/{idCliente}` - Por cliente
- `GET /api/ordenes/{id}/items` - Items de orden
- `POST /api/ordenes` - Crear orden
- `DELETE /api/ordenes/{id}` - Eliminar

---

## 🚀 Instalación Rápida

### Prerrequisitos

```bash
# Conectar al servidor
ssh usuario@10.242.64.6

# Verificar Java
java -version  # Debe ser Java 17+

# Verificar Maven
mvn -version   # Debe ser Maven 3.8+
```

### Instalación

```bash
# 1. Copiar proyecto al servidor
scp -r ecommerce-api/ usuario@10.242.64.6:~/

# 2. En el servidor, compilar
cd ~/ecommerce-api
./mvnw clean package

# 3. Ejecutar en modo desarrollo
./mvnw quarkus:dev

# 4. O ejecutar en producción
java -jar target/quarkus-app/quarkus-run.jar
```

---

## 📦 Estructura del Proyecto

```
ecommerce-api/
├── src/
│   ├── main/
│   │   ├── java/com/ecommerce/
│   │   │   ├── entity/          # Entidades JPA
│   │   │   ├── dto/             # DTOs
│   │   │   ├── repository/      # Repositorios Panache
│   │   │   ├── service/         # Servicios de negocio
│   │   │   ├── resource/        # Controllers REST
│   │   │   ├── mapper/          # MapStruct mappers
│   │   │   ├── exception/       # Manejo de excepciones
│   │   │   └── config/          # Configuración
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/ecommerce/
│           └── resource/        # Tests de APIs
├── pom.xml
└── README.md
```

---

## 🔧 Configuración

### application.properties

```properties
# Base de datos
quarkus.datasource.jdbc.url=jdbc:mysql://10.242.64.5:3306/ecommerce
quarkus.datasource.username=ecommerce_user
quarkus.datasource.password=<contraseña>

# CORS
quarkus.http.cors.origins=http://10.242.64.7:3000

# Puerto
quarkus.http.port=8080
```

---

## 📚 Documentación API

### Swagger UI
Una vez iniciada la aplicación, acceder a:
- **Swagger UI**: http://10.242.64.6:8080/swagger-ui
- **OpenAPI Spec**: http://10.242.64.6:8080/q/openapi

### Health Checks
- **Health**: http://10.242.64.6:8080/q/health
- **Liveness**: http://10.242.64.6:8080/q/health/live
- **Readiness**: http://10.242.64.6:8080/q/health/ready

### Métricas
- **Prometheus**: http://10.242.64.6:8080/q/metrics

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
./mvnw test

# Ejecutar tests de integración
./mvnw verify

# Con cobertura
./mvnw test jacoco:report
```

---

## 📖 Ejemplos de Uso

### Crear Cliente

```bash
curl -X POST http://10.242.64.6:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "direccion": "Av. Corrientes 1234",
    "idCiudad": 1,
    "idPais": 1,
    "telefono": "+54 11 1234-5678",
    "email": "juan.perez@email.com"
  }'
```

### Crear Orden

```bash
curl -X POST http://10.242.64.6:8080/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": 1,
    "items": [
      {
        "idProducto": 1001,
        "cantidad": 1
      },
      {
        "idProducto": 2001,
        "cantidad": 2
      }
    ]
  }'
```

### Listar Productos Disponibles

```bash
curl http://10.242.64.6:8080/api/productos/disponibles
```

---

## 🔒 Seguridad

- CORS configurado para frontend específico
- Validaciones en todas las entradas
- Manejo centralizado de excepciones
- Logs de auditoría
- Health checks para monitoreo

---

## 📊 Monitoreo

### Logs

```bash
# Ver logs en tiempo real
tail -f logs/application.log

# Buscar errores
grep ERROR logs/application.log
```

### Métricas Prometheus

```bash
# Obtener métricas
curl http://10.242.64.6:8080/q/metrics
```

---

## 🐛 Troubleshooting

### Problema: No conecta con MySQL

```bash
# Verificar conectividad
telnet 10.242.64.5 3306

# Verificar credenciales
mysql -h 10.242.64.5 -u ecommerce_user -p
```

### Problema: Puerto 8080 en uso

```bash
# Cambiar puerto en application.properties
quarkus.http.port=8081

# O matar proceso
lsof -ti:8080 | xargs kill -9
```

### Problema: Error de compilación

```bash
# Limpiar y recompilar
./mvnw clean install -DskipTests
```

---

## 📝 Archivos de Código

Todo el código fuente está documentado en:
- [`CODIGO_COMPLETO.md`](CODIGO_COMPLETO.md) - Repositorios, DTOs, Mappers, Excepciones
- [`CODIGO_COMPLETO_PARTE2.md`](CODIGO_COMPLETO_PARTE2.md) - Servicios y Resources REST
- [`PLAN.md`](PLAN.md) - Plan detallado con diagramas de arquitectura

---

## 🔄 Integración con Frontend

El frontend React debe configurar:

```javascript
// config.js
export const API_BASE_URL = 'http://10.242.64.6:8080/api';
```

---

## 📈 Performance

### Optimizaciones Implementadas
- Lazy loading de relaciones JPA
- Connection pooling (16 conexiones max)
- Cache de consultas frecuentes
- Paginación en listados grandes
- Índices en base de datos

### Objetivos
- Tiempo de respuesta < 200ms (p95)
- Throughput > 1000 req/s
- Disponibilidad > 99.9%

---

## 🚀 Despliegue en Producción

```bash
# 1. Compilar para producción
./mvnw package -Dquarkus.profile=prod

# 2. Ejecutar
java -jar target/quarkus-app/quarkus-run.jar

# 3. Como servicio systemd
sudo systemctl start ecommerce-api
sudo systemctl enable ecommerce-api
```

---

## 📞 Soporte

Para más información:
- Ver documentación completa en [`PLAN.md`](PLAN.md)
- Revisar código en archivos `CODIGO_COMPLETO*.md`
- Consultar guía de instalación en [`INSTALL.md`](INSTALL.md)

---

**Versión**: 1.0.0  
**Estado**: ✅ Listo para Desarrollo  
**Última actualización**: 2026-06-03