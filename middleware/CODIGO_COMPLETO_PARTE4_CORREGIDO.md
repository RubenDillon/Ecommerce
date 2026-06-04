# Código Completo del Middleware - Parte 4: DTOs CORREGIDOS

Esta parte contiene todos los DTOs necesarios que coinciden con los Mappers de MapStruct.

**IMPORTANTE**: Estos DTOs reemplazan los de CODIGO_COMPLETO_PARTE4.md y coinciden con los Mappers definidos en CODIGO_COMPLETO.md

## Dependencia Requerida en pom.xml

Asegúrate de tener Lombok en el pom.xml:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

## 1. PaisDTO.java

```java
// src/main/java/com/ecommerce/dto/PaisDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaisDTO {
    private Long idPais;
    private String nombre;
}
```

## 2. CiudadDTO.java

```java
// src/main/java/com/ecommerce/dto/CiudadDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CiudadDTO {
    private Long idCiudad;
    private String ciudad;
    private Long idPais;
    private String nombrePais;  // Mapeado desde pais.nombre
}
```

## 3. ClienteDTO.java

```java
// src/main/java/com/ecommerce/dto/ClienteDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long idCliente;
    private String nombre;
    private String direccion;
    private Long idCiudad;
    private String nombreCiudad;  // Mapeado desde ciudad.ciudad
    private Long idPais;
    private String nombrePais;    // Mapeado desde pais.nombre
    private String telefono;
    private String email;
    private LocalDateTime fechaRegistro;
}
```

## 4. ClaseDTO.java

```java
// src/main/java/com/ecommerce/dto/ClaseDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaseDTO {
    private Long idTipo;
    private String nombre;
}
```

## 5. ProductoDTO.java

```java
// src/main/java/com/ecommerce/dto/ProductoDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Integer sku;
    private Long idTipo;
    private String nombreClase;      // Mapeado desde clase.nombre
    private Integer stock;
    private String foto;
    private BigDecimal valorCosto;
    private BigDecimal valorVenta;
    private LocalDateTime fechaCreacion;
}
```

## 6. OrdenDTO.java

```java
// src/main/java/com/ecommerce/dto/OrdenDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private String nombreCliente;    // Mapeado desde cliente.nombre
    private LocalDateTime fecha;
    private List<ItemDTO> items;
    private BigDecimal total;        // Calculado con expression
    private Integer cantidadItems;   // Calculado con expression
}
```

## 7. ItemDTO.java

```java
// src/main/java/com/ecommerce/dto/ItemDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {
    private Long idOrden;
    private Long idProducto;
    private String nombreProducto;   // Mapeado desde producto.nombre
    private Integer cantidad;
    private BigDecimal precioVenta;
    private BigDecimal subtotal;     // Calculado con expression
}
```

## 8. CrearOrdenDTO.java

```java
// src/main/java/com/ecommerce/dto/CrearOrdenDTO.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearOrdenDTO {
    private Long idCliente;
    private List<ItemOrdenDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemOrdenDTO {
        private Long idProducto;
        private Integer cantidad;
    }
}
```

## 9. ErrorResponse.java

```java
// src/main/java/com/ecommerce/dto/ErrorResponse.java
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private Integer status;
    private String error;
    private String message;
    private String path;
    
    public ErrorResponse(Integer status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
```

## Diferencias Clave con CODIGO_COMPLETO_PARTE4.md

### 1. **Uso de Lombok**
- `@Data`: Genera getters, setters, toString, equals, hashCode
- `@NoArgsConstructor`: Constructor sin argumentos
- `@AllArgsConstructor`: Constructor con todos los argumentos

### 2. **Campos Adicionales Calculados**

#### CiudadDTO
- `nombrePais` - Mapeado desde `pais.nombre`

#### ClienteDTO
- `nombreCiudad` - Mapeado desde `ciudad.ciudad`
- `nombrePais` - Mapeado desde `pais.nombre`
- `fechaRegistro` - Campo de auditoría

#### ProductoDTO
- `nombreClase` - Mapeado desde `clase.nombre`
- `fechaCreacion` - Campo de auditoría
- Usa `BigDecimal` para precios (no `Double`)
- Usa `Integer` para SKU (no `Long`)

#### OrdenDTO
- `nombreCliente` - Mapeado desde `cliente.nombre`
- `total` - Calculado con expression en el Mapper
- `cantidadItems` - Calculado con expression en el Mapper
- Usa `LocalDateTime` para fecha (no `LocalDate`)

#### ItemDTO
- `nombreProducto` - Mapeado desde `producto.nombre`
- `cantidad` - Campo adicional
- `subtotal` - Calculado con expression en el Mapper

### 3. **Tipos de Datos Correctos**
- **Precios**: `BigDecimal` (no `Double`)
- **Fechas**: `LocalDateTime` (no `LocalDate`)
- **SKU**: `Integer` (no `Long`)
- **Email**: `email` (no `correoElectronico`)

### 4. **CrearOrdenDTO vs CreateOrdenRequest**
El DTO correcto es `CrearOrdenDTO` con una clase interna `ItemOrdenDTO` que incluye:
- `idProducto`
- `cantidad` (no `precioVenta`)

## Resumen de Archivos a Crear

Debes crear estos 9 archivos en:
```
/home/UV3FQQ2/git/Ecommerce/middleware/ecommerce-api/src/main/java/com/ecommerce/dto/
```

1. ✅ PaisDTO.java
2. ✅ CiudadDTO.java (con nombrePais)
3. ✅ ClienteDTO.java (con nombreCiudad, nombrePais, fechaRegistro)
4. ✅ ClaseDTO.java
5. ✅ ProductoDTO.java (con nombreClase, fechaCreacion, BigDecimal)
6. ✅ OrdenDTO.java (con nombreCliente, total, cantidadItems, LocalDateTime)
7. ✅ ItemDTO.java (con nombreProducto, cantidad, subtotal)
8. ✅ CrearOrdenDTO.java (con clase interna ItemOrdenDTO)
9. ✅ ErrorResponse.java

## Verificación de Compatibilidad con Mappers

### CiudadMapper ✅
```java
@Mapping(source = "pais.nombre", target = "nombrePais")
```
CiudadDTO tiene `nombrePais` ✅

### ClienteMapper ✅
```java
@Mapping(source = "ciudad.ciudad", target = "nombreCiudad")
@Mapping(source = "pais.nombre", target = "nombrePais")
```
ClienteDTO tiene `nombreCiudad` y `nombrePais` ✅

### ProductoMapper ✅
```java
@Mapping(source = "clase.nombre", target = "nombreClase")
```
ProductoDTO tiene `nombreClase` ✅

### OrdenMapper ✅
```java
@Mapping(source = "cliente.nombre", target = "nombreCliente")
@Mapping(expression = "java(orden.getTotal())", target = "total")
@Mapping(expression = "java(orden.getCantidadItems())", target = "cantidadItems")
```
OrdenDTO tiene `nombreCliente`, `total` y `cantidadItems` ✅

## Notas Importantes

1. **Lombok es obligatorio** - Sin Lombok, los DTOs no compilarán
2. **BigDecimal para dinero** - Nunca usar Double para valores monetarios
3. **LocalDateTime vs LocalDate** - La base de datos usa TIMESTAMP
4. **Nombres consistentes** - Los campos deben coincidir exactamente con los Mappers
5. **Clases internas** - CrearOrdenDTO.ItemOrdenDTO es una clase interna estática

## Compilación

Después de crear todos los archivos:

```bash
cd /home/UV3FQQ2/git/Ecommerce/middleware/ecommerce-api
./mvnw clean compile
```

Si todo está correcto, la compilación será exitosa sin errores de MapStruct.