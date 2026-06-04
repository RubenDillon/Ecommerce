# 🚨 CORRECCIÓN URGENTE - DTOs Incorrectos

## Problema Identificado

Los DTOs que creaste en el servidor **NO coinciden** con los Mappers de MapStruct. Por eso siguen apareciendo errores de compilación.

## Archivos que Debes REEMPLAZAR

Los siguientes archivos tienen campos faltantes y deben ser reemplazados:

### ❌ Archivos Incorrectos (los que creaste)
- CiudadDTO.java - Falta `nombrePais`
- ClienteDTO.java - Falta `nombreCiudad`, `nombrePais`, `fechaRegistro`
- ProductoDTO.java - Falta `nombreClase`, `fechaCreacion`, tipos incorrectos
- OrdenDTO.java - Falta `nombreCliente`, `total`, `cantidadItems`, tipo de fecha incorrecto
- OrdenItemDTO.java - Falta `nombreProducto`, `cantidad`, `subtotal`

### ✅ Archivos Correctos (usar CODIGO_COMPLETO_PARTE4_CORREGIDO.md)
Todos los DTOs en `CODIGO_COMPLETO_PARTE4_CORREGIDO.md` tienen los campos correctos.

## Acción Inmediata Requerida

### Paso 1: Eliminar DTOs Incorrectos

```bash
cd /home/UV3FQQ2/git/Ecommerce/middleware/ecommerce-api/src/main/java/com/ecommerce/dto/
rm -f CiudadDTO.java ClienteDTO.java ProductoDTO.java OrdenDTO.java OrdenItemDTO.java
```

### Paso 2: Crear DTOs Correctos

Usa el archivo `CODIGO_COMPLETO_PARTE4_CORREGIDO.md` disponible en GitHub:
https://github.com/RubenDillon/Ecommerce/blob/main/middleware/CODIGO_COMPLETO_PARTE4_CORREGIDO.md

## Comparación de Errores

### Error 1: CiudadDTO
```
[ERROR] Unknown property "nombrePais" in result type CiudadDTO
```

**Tu DTO (Incorrecto):**
```java
public class CiudadDTO {
    private Long idCiudad;
    private Long idPais;
    private String ciudad;
    private PaisDTO pais;  // ❌ Mapper no usa esto
}
```

**DTO Correcto:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CiudadDTO {
    private Long idCiudad;
    private String ciudad;
    private Long idPais;
    private String nombrePais;  // ✅ Mapper necesita esto
}
```

### Error 2: ClienteDTO
```
[ERROR] Unknown property "nombreCiudad" in result type ClienteDTO
[ERROR] Unknown property "nombrePais" in result type ClienteDTO
```

**Tu DTO (Incorrecto):**
```java
public class ClienteDTO {
    private Long idCliente;
    private String nombre;
    private String direccion;
    private Long idCiudad;
    private Long idPais;
    private String telefono;
    private String correoElectronico;  // ❌ Debe ser "email"
    private CiudadDTO ciudad;  // ❌ Mapper no usa esto
    private PaisDTO pais;      // ❌ Mapper no usa esto
}
```

**DTO Correcto:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long idCliente;
    private String nombre;
    private String direccion;
    private Long idCiudad;
    private String nombreCiudad;  // ✅ Mapper necesita esto
    private Long idPais;
    private String nombrePais;    // ✅ Mapper necesita esto
    private String telefono;
    private String email;         // ✅ Nombre correcto
    private LocalDateTime fechaRegistro;  // ✅ Campo de auditoría
}
```

### Error 3: ProductoDTO
```
[ERROR] Unknown property "nombreClase" in result type ProductoDTO
```

**Tu DTO (Incorrecto):**
```java
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Long sku;           // ❌ Debe ser Integer
    private Long idTipo;
    private Integer stock;
    private String foto;
    private Double valorCosto;  // ❌ Debe ser BigDecimal
    private Double valorVenta;  // ❌ Debe ser BigDecimal
    private ClaseDTO clase;     // ❌ Mapper no usa esto
}
```

**DTO Correcto:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Integer sku;              // ✅ Tipo correcto
    private Long idTipo;
    private String nombreClase;       // ✅ Mapper necesita esto
    private Integer stock;
    private String foto;
    private BigDecimal valorCosto;    // ✅ Tipo correcto para dinero
    private BigDecimal valorVenta;    // ✅ Tipo correcto para dinero
    private LocalDateTime fechaCreacion;  // ✅ Campo de auditoría
}
```

### Error 4: OrdenDTO
```
[ERROR] Unknown property "nombreCliente" in result type OrdenDTO
[ERROR] Unknown property "total" in result type OrdenDTO
[ERROR] Unknown property "cantidadItems" in result type OrdenDTO
```

**Tu DTO (Incorrecto):**
```java
public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private LocalDate fecha;        // ❌ Debe ser LocalDateTime
    private ClienteDTO cliente;     // ❌ Mapper no usa esto
    private List<OrdenItemDTO> items;
}
```

**DTO Correcto:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private String nombreCliente;    // ✅ Mapper necesita esto
    private LocalDateTime fecha;     // ✅ Tipo correcto
    private List<ItemDTO> items;
    private BigDecimal total;        // ✅ Mapper calcula esto
    private Integer cantidadItems;   // ✅ Mapper calcula esto
}
```

### Error 5: ItemDTO (OrdenItemDTO)
```
El mapper espera ItemDTO, no OrdenItemDTO
```

**Tu DTO (Incorrecto):**
```java
public class OrdenItemDTO {  // ❌ Nombre incorrecto
    private Long idOrden;
    private Long idProducto;
    private Double precioVenta;  // ❌ Debe ser BigDecimal
    private ProductoDTO producto;  // ❌ Mapper no usa esto
}
```

**DTO Correcto:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {  // ✅ Nombre correcto
    private Long idOrden;
    private Long idProducto;
    private String nombreProducto;   // ✅ Mapper necesita esto
    private Integer cantidad;        // ✅ Campo necesario
    private BigDecimal precioVenta;  // ✅ Tipo correcto
    private BigDecimal subtotal;     // ✅ Mapper calcula esto
}
```

## Lista Completa de DTOs Correctos

Debes crear estos 9 archivos usando `CODIGO_COMPLETO_PARTE4_CORREGIDO.md`:

1. ✅ **PaisDTO.java** - Simple, sin cambios
2. ⚠️ **CiudadDTO.java** - Agregar `nombrePais`
3. ⚠️ **ClienteDTO.java** - Agregar `nombreCiudad`, `nombrePais`, `fechaRegistro`, cambiar `correoElectronico` a `email`
4. ✅ **ClaseDTO.java** - Simple, sin cambios
5. ⚠️ **ProductoDTO.java** - Agregar `nombreClase`, `fechaCreacion`, cambiar tipos a `Integer` y `BigDecimal`
6. ⚠️ **OrdenDTO.java** - Agregar `nombreCliente`, `total`, `cantidadItems`, cambiar `LocalDate` a `LocalDateTime`
7. ⚠️ **ItemDTO.java** - Agregar `nombreProducto`, `cantidad`, `subtotal`, cambiar tipos a `BigDecimal`
8. ✅ **CrearOrdenDTO.java** - Usar este en lugar de CreateOrdenRequest
9. ✅ **ErrorResponse.java** - Para manejo de errores

## Verificación de Lombok

Asegúrate de que Lombok esté en el `pom.xml`:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

## Comandos para Corregir

```bash
# 1. Ir al directorio de DTOs
cd /home/UV3FQQ2/git/Ecommerce/middleware/ecommerce-api/src/main/java/com/ecommerce/dto/

# 2. Hacer backup de los archivos incorrectos
mkdir -p backup
mv *.java backup/

# 3. Descargar la documentación actualizada
cd /home/UV3FQQ2/git/Ecommerce
git pull origin main

# 4. Abrir CODIGO_COMPLETO_PARTE4_CORREGIDO.md y copiar cada DTO
cat middleware/CODIGO_COMPLETO_PARTE4_CORREGIDO.md

# 5. Crear cada archivo con el contenido correcto
# (Copiar manualmente cada clase desde el archivo .md)

# 6. Compilar
cd /home/UV3FQQ2/git/Ecommerce/middleware/ecommerce-api
./mvnw clean compile
```

## Resumen de Cambios Críticos

| Campo | Tu Versión | Versión Correcta |
|-------|-----------|------------------|
| CiudadDTO.nombrePais | ❌ No existe | ✅ String nombrePais |
| ClienteDTO.nombreCiudad | ❌ No existe | ✅ String nombreCiudad |
| ClienteDTO.nombrePais | ❌ No existe | ✅ String nombrePais |
| ClienteDTO.email | ❌ correoElectronico | ✅ email |
| ProductoDTO.sku | ❌ Long | ✅ Integer |
| ProductoDTO.nombreClase | ❌ No existe | ✅ String nombreClase |
| ProductoDTO.valorCosto | ❌ Double | ✅ BigDecimal |
| ProductoDTO.valorVenta | ❌ Double | ✅ BigDecimal |
| OrdenDTO.nombreCliente | ❌ No existe | ✅ String nombreCliente |
| OrdenDTO.total | ❌ No existe | ✅ BigDecimal total |
| OrdenDTO.cantidadItems | ❌ No existe | ✅ Integer cantidadItems |
| OrdenDTO.fecha | ❌ LocalDate | ✅ LocalDateTime |
| ItemDTO.nombreProducto | ❌ No existe | ✅ String nombreProducto |
| ItemDTO.cantidad | ❌ No existe | ✅ Integer cantidad |
| ItemDTO.subtotal | ❌ No existe | ✅ BigDecimal subtotal |

## Próximos Pasos

1. ✅ Eliminar DTOs incorrectos
2. ✅ Crear DTOs correctos desde CODIGO_COMPLETO_PARTE4_CORREGIDO.md
3. ✅ Verificar que Lombok esté en pom.xml
4. ✅ Compilar: `./mvnw clean compile`
5. ✅ Si compila sin errores, ejecutar: `./mvnw quarkus:dev`
6. ✅ Probar endpoints: `curl http://10.242.64.6:8080/api/paises`

## Archivo de Referencia

**Usa este archivo como referencia:**
- GitHub: https://github.com/RubenDillon/Ecommerce/blob/main/middleware/CODIGO_COMPLETO_PARTE4_CORREGIDO.md
- Local: `/home/UV3FQQ2/git/Ecommerce/middleware/CODIGO_COMPLETO_PARTE4_CORREGIDO.md`

**NO uses:**
- ❌ CODIGO_COMPLETO_PARTE4.md (versión antigua, incorrecta)