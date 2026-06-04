# Instrucciones para Compilar el Middleware

## Problema Actual

Los errores de compilación de MapStruct ocurren porque **los DTOs en el servidor no coinciden con los Mappers**.

## Solución

Los DTOs correctos están en el archivo `CODIGO_COMPLETO.md` (líneas 198-421). Estos DTOs usan **Lombok** y tienen todos los campos que los Mappers necesitan.

## Pasos para Corregir

### 1. Descargar Documentación Actualizada

```bash
cd /home/UV3FQQ2/git/Ecommerce
git pull origin main
```

### 2. Verificar Lombok en pom.xml

Asegúrate de que Lombok esté en el `pom.xml`:

```bash
cd middleware/ecommerce-api
grep -A 5 "lombok" pom.xml
```

Si no está, agrégalo:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### 3. Eliminar DTOs Incorrectos

```bash
cd src/main/java/com/ecommerce/dto/
rm -f *.java
```

### 4. Crear DTOs Correctos

Abre el archivo `CODIGO_COMPLETO.md` y copia cada DTO (9 archivos):

```bash
cd /home/UV3FQQ2/git/Ecommerce/middleware
cat CODIGO_COMPLETO.md
```

Crea estos archivos en `src/main/java/com/ecommerce/dto/`:

1. **PaisDTO.java** (líneas 200-216)
2. **CiudadDTO.java** (líneas 218-236) - Con `nombrePais`
3. **ClienteDTO.java** (líneas 238-264) - Con `nombreCiudad`, `nombrePais`, `fechaRegistro`
4. **ClaseDTO.java** (líneas 266-282)
5. **ProductoDTO.java** (líneas 284-311) - Con `nombreClase`, `fechaCreacion`, `BigDecimal`
6. **OrdenDTO.java** (líneas 313-338) - Con `nombreCliente`, `total`, `cantidadItems`
7. **ItemDTO.java** (líneas 340-362) - Con `nombreProducto`, `cantidad`, `subtotal`
8. **CrearOrdenDTO.java** (líneas 364-390)
9. **ErrorResponse.java** (líneas 392-421)

### 5. Campos Críticos que Deben Estar

| DTO | Campos Obligatorios |
|-----|---------------------|
| CiudadDTO | `nombrePais` (String) |
| ClienteDTO | `nombreCiudad` (String), `nombrePais` (String), `email` (String), `fechaRegistro` (LocalDateTime) |
| ProductoDTO | `sku` (Integer), `nombreClase` (String), `valorCosto` (BigDecimal), `valorVenta` (BigDecimal), `fechaCreacion` (LocalDateTime) |
| OrdenDTO | `nombreCliente` (String), `fecha` (LocalDateTime), `total` (BigDecimal), `cantidadItems` (Integer) |
| ItemDTO | `nombreProducto` (String), `cantidad` (Integer), `precioVenta` (BigDecimal), `subtotal` (BigDecimal) |

### 6. Compilar

```bash
cd /home/UV3FQQ2/git/Ecommerce/middleware/ecommerce-api
./mvnw clean compile
```

Si la compilación es exitosa, verás:
```
[INFO] BUILD SUCCESS
```

### 7. Ejecutar la Aplicación

```bash
./mvnw quarkus:dev
```

La aplicación iniciará en el puerto 8080.

### 8. Probar los Endpoints

```bash
# Listar países
curl http://10.242.64.6:8080/api/paises

# Listar ciudades
curl http://10.242.64.6:8080/api/ciudades

# Listar clientes
curl http://10.242.64.6:8080/api/clientes

# Listar productos
curl http://10.242.64.6:8080/api/productos

# Listar clases
curl http://10.242.64.6:8080/api/clases

# Listar órdenes
curl http://10.242.64.6:8080/api/ordenes
```

## Errores Comunes y Soluciones

### Error: "Unknown property nombrePais"
**Causa**: Falta el campo `nombrePais` en CiudadDTO  
**Solución**: Agregar `private String nombrePais;`

### Error: "Unknown property nombreCiudad"
**Causa**: Falta el campo `nombreCiudad` en ClienteDTO  
**Solución**: Agregar `private String nombreCiudad;`

### Error: "Unknown property nombreClase"
**Causa**: Falta el campo `nombreClase` en ProductoDTO  
**Solución**: Agregar `private String nombreClase;`

### Error: "Unknown property total"
**Causa**: Falta el campo `total` en OrdenDTO  
**Solución**: Agregar `private BigDecimal total;`

### Error: "cannot find symbol @Data"
**Causa**: Falta Lombok en el pom.xml  
**Solución**: Agregar la dependencia de Lombok

## Estructura de Archivos Final

```
middleware/
├── CODIGO_COMPLETO.md          # Entities, Repositories, DTOs, Mappers, Exceptions
├── CODIGO_COMPLETO_PARTE2.md   # Services
├── CODIGO_COMPLETO_PARTE3.md   # Resources (Controllers)
├── INSTALL.md                  # Guía de instalación
├── README.md                   # Documentación general
└── ecommerce-api/
    └── src/main/java/com/ecommerce/
        ├── dto/                # 9 archivos DTO
        ├── entity/             # 8 archivos Entity
        ├── repository/         # 7 archivos Repository
        ├── mapper/             # 7 archivos Mapper
        ├── service/            # 6 archivos Service
        ├── resource/           # 6 archivos Resource
        └── exception/          # 3 archivos Exception
```

## Documentación de Referencia

- **CODIGO_COMPLETO.md** - Código de Entities, Repositories, DTOs, Mappers, Exceptions
- **CODIGO_COMPLETO_PARTE2.md** - Código de Services
- **CODIGO_COMPLETO_PARTE3.md** - Código de Resources (Controllers REST)

## Notas Importantes

1. **Todos los DTOs usan Lombok** - No olvides las anotaciones `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
2. **BigDecimal para dinero** - Nunca usar Double para valores monetarios
3. **LocalDateTime para fechas** - La base de datos usa TIMESTAMP
4. **Integer para SKU** - No Long
5. **email no correoElectronico** - El campo se llama `email`

## Contacto

Si tienes problemas, revisa los archivos de código completo en GitHub:
https://github.com/RubenDillon/Ecommerce/tree/main/middleware