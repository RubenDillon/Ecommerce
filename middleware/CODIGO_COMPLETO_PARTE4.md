# Código Completo del Middleware - Parte 4: DTOs (Data Transfer Objects)

Esta parte contiene todos los DTOs necesarios para la transferencia de datos entre capas.

## 1. PaisDTO.java

```java
// src/main/java/com/ecommerce/dto/PaisDTO.java
package com.ecommerce.dto;

public class PaisDTO {
    private Long idPais;
    private String nombre;

    // Constructors
    public PaisDTO() {
    }

    public PaisDTO(Long idPais, String nombre) {
        this.idPais = idPais;
        this.nombre = nombre;
    }

    // Getters and Setters
    public Long getIdPais() {
        return idPais;
    }

    public void setIdPais(Long idPais) {
        this.idPais = idPais;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
```

## 2. CiudadDTO.java

```java
// src/main/java/com/ecommerce/dto/CiudadDTO.java
package com.ecommerce.dto;

public class CiudadDTO {
    private Long idCiudad;
    private Long idPais;
    private String ciudad;
    private PaisDTO pais;

    // Constructors
    public CiudadDTO() {
    }

    public CiudadDTO(Long idCiudad, Long idPais, String ciudad) {
        this.idCiudad = idCiudad;
        this.idPais = idPais;
        this.ciudad = ciudad;
    }

    // Getters and Setters
    public Long getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(Long idCiudad) {
        this.idCiudad = idCiudad;
    }

    public Long getIdPais() {
        return idPais;
    }

    public void setIdPais(Long idPais) {
        this.idPais = idPais;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public PaisDTO getPais() {
        return pais;
    }

    public void setPais(PaisDTO pais) {
        this.pais = pais;
    }
}
```

## 3. ClienteDTO.java

```java
// src/main/java/com/ecommerce/dto/ClienteDTO.java
package com.ecommerce.dto;

public class ClienteDTO {
    private Long idCliente;
    private String nombre;
    private String direccion;
    private Long idCiudad;
    private Long idPais;
    private String telefono;
    private String correoElectronico;
    private CiudadDTO ciudad;
    private PaisDTO pais;

    // Constructors
    public ClienteDTO() {
    }

    // Getters and Setters
    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Long getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(Long idCiudad) {
        this.idCiudad = idCiudad;
    }

    public Long getIdPais() {
        return idPais;
    }

    public void setIdPais(Long idPais) {
        this.idPais = idPais;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public CiudadDTO getCiudad() {
        return ciudad;
    }

    public void setCiudad(CiudadDTO ciudad) {
        this.ciudad = ciudad;
    }

    public PaisDTO getPais() {
        return pais;
    }

    public void setPais(PaisDTO pais) {
        this.pais = pais;
    }
}
```

## 4. ClaseDTO.java

```java
// src/main/java/com/ecommerce/dto/ClaseDTO.java
package com.ecommerce.dto;

public class ClaseDTO {
    private Long idTipo;
    private String nombre;

    // Constructors
    public ClaseDTO() {
    }

    public ClaseDTO(Long idTipo, String nombre) {
        this.idTipo = idTipo;
        this.nombre = nombre;
    }

    // Getters and Setters
    public Long getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(Long idTipo) {
        this.idTipo = idTipo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
```

## 5. ProductoDTO.java

```java
// src/main/java/com/ecommerce/dto/ProductoDTO.java
package com.ecommerce.dto;

public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Long sku;
    private Long idTipo;
    private Integer stock;
    private String foto;
    private Double valorCosto;
    private Double valorVenta;
    private ClaseDTO clase;

    // Constructors
    public ProductoDTO() {
    }

    // Getters and Setters
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getSku() {
        return sku;
    }

    public void setSku(Long sku) {
        this.sku = sku;
    }

    public Long getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(Long idTipo) {
        this.idTipo = idTipo;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Double getValorCosto() {
        return valorCosto;
    }

    public void setValorCosto(Double valorCosto) {
        this.valorCosto = valorCosto;
    }

    public Double getValorVenta() {
        return valorVenta;
    }

    public void setValorVenta(Double valorVenta) {
        this.valorVenta = valorVenta;
    }

    public ClaseDTO getClase() {
        return clase;
    }

    public void setClase(ClaseDTO clase) {
        this.clase = clase;
    }
}
```

## 6. OrdenDTO.java

```java
// src/main/java/com/ecommerce/dto/OrdenDTO.java
package com.ecommerce.dto;

import java.time.LocalDate;
import java.util.List;

public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private LocalDate fecha;
    private ClienteDTO cliente;
    private List<OrdenItemDTO> items;

    // Constructors
    public OrdenDTO() {
    }

    // Getters and Setters
    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public List<OrdenItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrdenItemDTO> items) {
        this.items = items;
    }
}
```

## 7. OrdenItemDTO.java

```java
// src/main/java/com/ecommerce/dto/OrdenItemDTO.java
package com.ecommerce.dto;

public class OrdenItemDTO {
    private Long idOrden;
    private Long idProducto;
    private Double precioVenta;
    private ProductoDTO producto;

    // Constructors
    public OrdenItemDTO() {
    }

    public OrdenItemDTO(Long idOrden, Long idProducto, Double precioVenta) {
        this.idOrden = idOrden;
        this.idProducto = idProducto;
        this.precioVenta = precioVenta;
    }

    // Getters and Setters
    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public ProductoDTO getProducto() {
        return producto;
    }

    public void setProducto(ProductoDTO producto) {
        this.producto = producto;
    }
}
```

## 8. CreateOrdenRequest.java

```java
// src/main/java/com/ecommerce/dto/CreateOrdenRequest.java
package com.ecommerce.dto;

import java.util.List;

public class CreateOrdenRequest {
    private Long idCliente;
    private List<CreateOrdenItemRequest> items;

    // Constructors
    public CreateOrdenRequest() {
    }

    public CreateOrdenRequest(Long idCliente, List<CreateOrdenItemRequest> items) {
        this.idCliente = idCliente;
        this.items = items;
    }

    // Getters and Setters
    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public List<CreateOrdenItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateOrdenItemRequest> items) {
        this.items = items;
    }
}
```

## 9. CreateOrdenItemRequest.java

```java
// src/main/java/com/ecommerce/dto/CreateOrdenItemRequest.java
package com.ecommerce.dto;

public class CreateOrdenItemRequest {
    private Long idProducto;
    private Double precioVenta;

    // Constructors
    public CreateOrdenItemRequest() {
    }

    public CreateOrdenItemRequest(Long idProducto, Double precioVenta) {
        this.idProducto = idProducto;
        this.precioVenta = precioVenta;
    }

    // Getters and Setters
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }
}
```

## Resumen de DTOs

### DTOs Principales (7)
1. **PaisDTO** - Datos de país
2. **CiudadDTO** - Datos de ciudad con referencia a país
3. **ClienteDTO** - Datos completos del cliente
4. **ClaseDTO** - Categoría de producto
5. **ProductoDTO** - Datos completos del producto
6. **OrdenDTO** - Datos de la orden con items
7. **OrdenItemDTO** - Item individual de una orden

### DTOs de Request (2)
8. **CreateOrdenRequest** - Request para crear una orden
9. **CreateOrdenItemRequest** - Item para crear en una orden

## Notas Importantes

1. **Todos los DTOs son POJOs** (Plain Old Java Objects) con:
   - Constructor vacío
   - Getters y Setters
   - Sin lógica de negocio

2. **Relaciones entre DTOs:**
   - CiudadDTO incluye PaisDTO
   - ClienteDTO incluye CiudadDTO y PaisDTO
   - ProductoDTO incluye ClaseDTO
   - OrdenDTO incluye ClienteDTO y List<OrdenItemDTO>
   - OrdenItemDTO incluye ProductoDTO

3. **CreateOrdenRequest** se usa para:
   - Crear nuevas órdenes desde el frontend
   - Incluye el ID del cliente y lista de items
   - Cada item tiene idProducto y precioVenta

4. **Tipos de datos:**
   - IDs: Long
   - Nombres y textos: String
   - Cantidades: Integer
   - Precios: Double
   - Fechas: LocalDate

5. **Los Mappers** (MapStruct) se encargan de convertir entre Entity y DTO automáticamente

## Ejemplo de Uso

### Crear una Orden desde el Frontend

```json
{
  "idCliente": 1,
  "items": [
    {
      "idProducto": 5,
      "precioVenta": 150000.0
    },
    {
      "idProducto": 12,
      "precioVenta": 85000.0
    }
  ]
}
```

Este JSON se deserializa automáticamente a `CreateOrdenRequest` y se procesa en el servicio.