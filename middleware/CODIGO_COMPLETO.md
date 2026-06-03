# Código Completo del Middleware - E-commerce API

Este documento contiene todo el código fuente del middleware Quarkus para la aplicación de e-commerce.

---

## 📦 Repositorios (Panache)

### PaisRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Pais;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class PaisRepository implements PanacheRepository<Pais> {
    
    public Optional<Pais> findByNombre(String nombre) {
        return find("nombre", nombre).firstResultOptional();
    }
    
    public boolean existsByNombre(String nombre) {
        return count("nombre", nombre) > 0;
    }
}
```

### CiudadRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Ciudad;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class CiudadRepository implements PanacheRepository<Ciudad> {
    
    public List<Ciudad> findByPaisId(Long idPais) {
        return list("pais.idPais", idPais);
    }
    
    public boolean existsByCiudadAndPaisId(String ciudad, Long idPais) {
        return count("ciudad = ?1 and pais.idPais = ?2", ciudad, idPais) > 0;
    }
}
```

### ClienteRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Cliente;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ClienteRepository implements PanacheRepository<Cliente> {
    
    public Optional<Cliente> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
    
    public List<Cliente> findByPaisId(Long idPais) {
        return list("pais.idPais", idPais);
    }
    
    public List<Cliente> findByCiudadId(Long idCiudad) {
        return list("ciudad.idCiudad", idCiudad);
    }
    
    public boolean existsByEmail(String email) {
        return count("email", email) > 0;
    }
}
```

### ClaseRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Clase;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class ClaseRepository implements PanacheRepository<Clase> {
    
    public Optional<Clase> findByNombre(String nombre) {
        return find("nombre", nombre).firstResultOptional();
    }
    
    public boolean existsByNombre(String nombre) {
        return count("nombre", nombre) > 0;
    }
}
```

### ProductoRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Producto;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductoRepository implements PanacheRepository<Producto> {
    
    public Optional<Producto> findBySku(Integer sku) {
        return find("sku", sku).firstResultOptional();
    }
    
    public List<Producto> findByClaseId(Long idTipo) {
        return list("clase.idTipo", idTipo);
    }
    
    public List<Producto> findDisponibles() {
        return list("stock > 0");
    }
    
    public boolean existsBySku(Integer sku) {
        return count("sku", sku) > 0;
    }
}
```

### OrdenRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Orden;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class OrdenRepository implements PanacheRepository<Orden> {
    
    public List<Orden> findByClienteId(Long idCliente) {
        return list("cliente.idCliente", idCliente);
    }
    
    public List<Orden> findRecientes(int limit) {
        return find("ORDER BY fecha DESC").page(0, limit).list();
    }
}
```

### ItemRepository.java

```java
package com.ecommerce.repository;

import com.ecommerce.entity.Item;
import com.ecommerce.entity.ItemId;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ItemRepository implements PanacheRepositoryBase<Item, ItemId> {
    
    public List<Item> findByOrdenId(Long idOrden) {
        return list("orden.idOrden", idOrden);
    }
    
    public List<Item> findByProductoId(Long idProducto) {
        return list("producto.idProducto", idProducto);
    }
}
```

---

## 📋 DTOs (Data Transfer Objects)

### PaisDTO.java

```java
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

### CiudadDTO.java

```java
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
    private String nombrePais;
}
```

### ClienteDTO.java

```java
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
    private String nombreCiudad;
    private Long idPais;
    private String nombrePais;
    private String telefono;
    private String email;
    private LocalDateTime fechaRegistro;
}
```

### ClaseDTO.java

```java
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

### ProductoDTO.java

```java
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
    private String nombreClase;
    private Integer stock;
    private String foto;
    private BigDecimal valorCosto;
    private BigDecimal valorVenta;
    private LocalDateTime fechaCreacion;
}
```

### OrdenDTO.java

```java
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
    private String nombreCliente;
    private LocalDateTime fecha;
    private List<ItemDTO> items;
    private BigDecimal total;
    private Integer cantidadItems;
}
```

### ItemDTO.java

```java
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
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioVenta;
    private BigDecimal subtotal;
}
```

### CrearOrdenDTO.java

```java
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

### ErrorResponse.java

```java
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

---

## 🗺️ Mappers (MapStruct)

### PaisMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.PaisDTO;
import com.ecommerce.entity.Pais;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface PaisMapper {
    
    PaisDTO toDTO(Pais pais);
    
    Pais toEntity(PaisDTO dto);
    
    List<PaisDTO> toDTOList(List<Pais> paises);
}
```

### CiudadMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.CiudadDTO;
import com.ecommerce.entity.Ciudad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface CiudadMapper {
    
    @Mapping(source = "pais.idPais", target = "idPais")
    @Mapping(source = "pais.nombre", target = "nombrePais")
    CiudadDTO toDTO(Ciudad ciudad);
    
    @Mapping(target = "pais", ignore = true)
    @Mapping(target = "clientes", ignore = true)
    Ciudad toEntity(CiudadDTO dto);
    
    List<CiudadDTO> toDTOList(List<Ciudad> ciudades);
}
```

### ClienteMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.ClienteDTO;
import com.ecommerce.entity.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ClienteMapper {
    
    @Mapping(source = "ciudad.idCiudad", target = "idCiudad")
    @Mapping(source = "ciudad.ciudad", target = "nombreCiudad")
    @Mapping(source = "pais.idPais", target = "idPais")
    @Mapping(source = "pais.nombre", target = "nombrePais")
    ClienteDTO toDTO(Cliente cliente);
    
    @Mapping(target = "ciudad", ignore = true)
    @Mapping(target = "pais", ignore = true)
    @Mapping(target = "ordenes", ignore = true)
    @Mapping(target = "fechaRegistro", ignore = true)
    Cliente toEntity(ClienteDTO dto);
    
    List<ClienteDTO> toDTOList(List<Cliente> clientes);
}
```

### ClaseMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.ClaseDTO;
import com.ecommerce.entity.Clase;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ClaseMapper {
    
    ClaseDTO toDTO(Clase clase);
    
    Clase toEntity(ClaseDTO dto);
    
    List<ClaseDTO> toDTOList(List<Clase> clases);
}
```

### ProductoMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProductoMapper {
    
    @Mapping(source = "clase.idTipo", target = "idTipo")
    @Mapping(source = "clase.nombre", target = "nombreClase")
    ProductoDTO toDTO(Producto producto);
    
    @Mapping(target = "clase", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    Producto toEntity(ProductoDTO dto);
    
    List<ProductoDTO> toDTOList(List<Producto> productos);
}
```

### OrdenMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.entity.Orden;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI, uses = {ItemMapper.class})
public interface OrdenMapper {
    
    @Mapping(source = "cliente.idCliente", target = "idCliente")
    @Mapping(source = "cliente.nombre", target = "nombreCliente")
    @Mapping(expression = "java(orden.getTotal())", target = "total")
    @Mapping(expression = "java(orden.getCantidadItems())", target = "cantidadItems")
    OrdenDTO toDTO(Orden orden);
    
    List<OrdenDTO> toDTOList(List<Orden> ordenes);
}
```

### ItemMapper.java

```java
package com.ecommerce.mapper;

import com.ecommerce.dto.ItemDTO;
import com.ecommerce.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ItemMapper {
    
    @Mapping(source = "id.idOrden", target = "idOrden")
    @Mapping(source = "id.idProducto", target = "idProducto")
    @Mapping(source = "producto.nombre", target = "nombreProducto")
    @Mapping(expression = "java(item.getSubtotal())", target = "subtotal")
    ItemDTO toDTO(Item item);
    
    List<ItemDTO> toDTOList(List<Item> items);
}
```

---

## ⚠️ Excepciones

### ResourceNotFoundException.java

```java
package com.ecommerce.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s no encontrado con %s: '%s'", resource, field, value));
    }
}
```

### BusinessException.java

```java
package com.ecommerce.exception;

public class BusinessException extends RuntimeException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### GlobalExceptionHandler.java

```java
package com.ecommerce.exception;

import com.ecommerce.dto.ErrorResponse;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {
    
    @Override
    public Response toResponse(Exception exception) {
        if (exception instanceof ResourceNotFoundException) {
            ErrorResponse error = new ErrorResponse(
                404,
                "Not Found",
                exception.getMessage(),
                ""
            );
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }
        
        if (exception instanceof BusinessException) {
            ErrorResponse error = new ErrorResponse(
                400,
                "Bad Request",
                exception.getMessage(),
                ""
            );
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }
        
        ErrorResponse error = new ErrorResponse(
            500,
            "Internal Server Error",
            "Ha ocurrido un error inesperado",
            ""
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}
```

---

## 🔧 Configuración

### CorsConfig.java

```java
package com.ecommerce.config;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.jboss.logging.Logger;

@ApplicationScoped
public class CorsConfig {
    
    private static final Logger LOG = Logger.getLogger(CorsConfig.class);
    
    void onStart(@Observes StartupEvent ev) {
        LOG.info("CORS configurado para permitir origen: http://10.242.64.7:3000");
    }
}
```

---

**Continúa en la siguiente sección...**