# Código Completo del Middleware - Parte 3: Resources (Controllers REST)

Esta parte contiene todos los controladores REST que exponen los endpoints de la API.

## 1. PaisResource.java

```java
// src/main/java/com/ecommerce/resource/PaisResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.PaisDTO;
import com.ecommerce.service.PaisService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/paises")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaisResource {

    @Inject
    PaisService paisService;

    @GET
    public List<PaisDTO> getAll() {
        return paisService.findAll();
    }

    @GET
    @Path("/{id}")
    public PaisDTO getById(@PathParam("id") Long id) {
        return paisService.findById(id);
    }

    @POST
    public Response create(PaisDTO paisDTO) {
        PaisDTO created = paisService.create(paisDTO);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public PaisDTO update(@PathParam("id") Long id, PaisDTO paisDTO) {
        return paisService.update(id, paisDTO);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        paisService.delete(id);
        return Response.noContent().build();
    }
}
```

## 2. CiudadResource.java

```java
// src/main/java/com/ecommerce/resource/CiudadResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.CiudadDTO;
import com.ecommerce.service.CiudadService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/ciudades")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CiudadResource {

    @Inject
    CiudadService ciudadService;

    @GET
    public List<CiudadDTO> getAll() {
        return ciudadService.findAll();
    }

    @GET
    @Path("/{id}")
    public CiudadDTO getById(@PathParam("id") Long id) {
        return ciudadService.findById(id);
    }

    @GET
    @Path("/pais/{idPais}")
    public List<CiudadDTO> getByPais(@PathParam("idPais") Long idPais) {
        return ciudadService.findByPais(idPais);
    }

    @POST
    public Response create(CiudadDTO ciudadDTO) {
        CiudadDTO created = ciudadService.create(ciudadDTO);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public CiudadDTO update(@PathParam("id") Long id, CiudadDTO ciudadDTO) {
        return ciudadService.update(id, ciudadDTO);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        ciudadService.delete(id);
        return Response.noContent().build();
    }
}
```

## 3. ClienteResource.java

```java
// src/main/java/com/ecommerce/resource/ClienteResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.ClienteDTO;
import com.ecommerce.service.ClienteService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteResource {

    @Inject
    ClienteService clienteService;

    @GET
    public List<ClienteDTO> getAll() {
        return clienteService.findAll();
    }

    @GET
    @Path("/{id}")
    public ClienteDTO getById(@PathParam("id") Long id) {
        return clienteService.findById(id);
    }

    @GET
    @Path("/search")
    public List<ClienteDTO> search(@QueryParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return clienteService.findAll();
        }
        return clienteService.search(query);
    }

    @GET
    @Path("/pais/{idPais}")
    public List<ClienteDTO> getByPais(@PathParam("idPais") Long idPais) {
        return clienteService.findByPais(idPais);
    }

    @GET
    @Path("/ciudad/{idCiudad}")
    public List<ClienteDTO> getByCiudad(@PathParam("idCiudad") Long idCiudad) {
        return clienteService.findByCiudad(idCiudad);
    }

    @POST
    public Response create(ClienteDTO clienteDTO) {
        ClienteDTO created = clienteService.create(clienteDTO);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public ClienteDTO update(@PathParam("id") Long id, ClienteDTO clienteDTO) {
        return clienteService.update(id, clienteDTO);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        clienteService.delete(id);
        return Response.noContent().build();
    }
}
```

## 4. ClaseResource.java

```java
// src/main/java/com/ecommerce/resource/ClaseResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.ClaseDTO;
import com.ecommerce.service.ClaseService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/clases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClaseResource {

    @Inject
    ClaseService claseService;

    @GET
    public List<ClaseDTO> getAll() {
        return claseService.findAll();
    }

    @GET
    @Path("/{id}")
    public ClaseDTO getById(@PathParam("id") Long id) {
        return claseService.findById(id);
    }

    @POST
    public Response create(ClaseDTO claseDTO) {
        ClaseDTO created = claseService.create(claseDTO);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public ClaseDTO update(@PathParam("id") Long id, ClaseDTO claseDTO) {
        return claseService.update(id, claseDTO);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        claseService.delete(id);
        return Response.noContent().build();
    }
}
```

## 5. ProductoResource.java

```java
// src/main/java/com/ecommerce/resource/ProductoResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.service.ProductoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoResource {

    @Inject
    ProductoService productoService;

    @GET
    public List<ProductoDTO> getAll() {
        return productoService.findAll();
    }

    @GET
    @Path("/{id}")
    public ProductoDTO getById(@PathParam("id") Long id) {
        return productoService.findById(id);
    }

    @GET
    @Path("/search")
    public List<ProductoDTO> search(@QueryParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return productoService.findAll();
        }
        return productoService.search(query);
    }

    @GET
    @Path("/clase/{idTipo}")
    public List<ProductoDTO> getByClase(@PathParam("idTipo") Long idTipo) {
        return productoService.findByClase(idTipo);
    }

    @GET
    @Path("/sku/{sku}")
    public ProductoDTO getBySku(@PathParam("sku") Long sku) {
        return productoService.findBySku(sku);
    }

    @GET
    @Path("/disponibles")
    public List<ProductoDTO> getDisponibles() {
        return productoService.findDisponibles();
    }

    @GET
    @Path("/bajo-stock")
    public List<ProductoDTO> getBajoStock(@QueryParam("limite") @DefaultValue("10") Integer limite) {
        return productoService.findBajoStock(limite);
    }

    @POST
    public Response create(ProductoDTO productoDTO) {
        ProductoDTO created = productoService.create(productoDTO);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public ProductoDTO update(@PathParam("id") Long id, ProductoDTO productoDTO) {
        return productoService.update(id, productoDTO);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        productoService.delete(id);
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}/stock")
    public ProductoDTO updateStock(@PathParam("id") Long id, StockUpdateRequest request) {
        return productoService.updateStock(id, request.getCantidad());
    }

    // Clase interna para la solicitud de actualización de stock
    public static class StockUpdateRequest {
        private Integer cantidad;

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
```

## 6. OrdenResource.java

```java
// src/main/java/com/ecommerce/resource/OrdenResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.CreateOrdenRequest;
import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.dto.OrdenItemDTO;
import com.ecommerce.service.OrdenService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.List;

@Path("/api/ordenes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrdenResource {

    @Inject
    OrdenService ordenService;

    @GET
    public List<OrdenDTO> getAll() {
        return ordenService.findAll();
    }

    @GET
    @Path("/{id}")
    public OrdenDTO getById(@PathParam("id") Long id) {
        return ordenService.findById(id);
    }

    @GET
    @Path("/cliente/{idCliente}")
    public List<OrdenDTO> getByCliente(@PathParam("idCliente") Long idCliente) {
        return ordenService.findByCliente(idCliente);
    }

    @GET
    @Path("/fecha/{fecha}")
    public List<OrdenDTO> getByFecha(@PathParam("fecha") String fecha) {
        LocalDate localDate = LocalDate.parse(fecha);
        return ordenService.findByFecha(localDate);
    }

    @GET
    @Path("/{id}/items")
    public List<OrdenItemDTO> getItems(@PathParam("id") Long id) {
        return ordenService.findItemsByOrden(id);
    }

    @GET
    @Path("/{id}/total")
    public Response getTotal(@PathParam("id") Long id) {
        Double total = ordenService.calculateTotal(id);
        return Response.ok().entity(new TotalResponse(total)).build();
    }

    @POST
    public Response create(CreateOrdenRequest request) {
        OrdenDTO created = ordenService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        ordenService.delete(id);
        return Response.noContent().build();
    }

    // Clase interna para la respuesta del total
    public static class TotalResponse {
        private Double total;

        public TotalResponse(Double total) {
            this.total = total;
        }

        public Double getTotal() {
            return total;
        }

        public void setTotal(Double total) {
            this.total = total;
        }
    }
}
```

## Resumen de Endpoints

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
- `GET /api/clientes/search?q={query}` - Buscar
- `GET /api/clientes/pais/{idPais}` - Por país
- `GET /api/clientes/ciudad/{idCiudad}` - Por ciudad
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
- `GET /api/productos/search?q={query}` - Buscar
- `GET /api/productos/clase/{idTipo}` - Por clase
- `GET /api/productos/sku/{sku}` - Por SKU
- `GET /api/productos/disponibles` - Con stock
- `GET /api/productos/bajo-stock?limite={n}` - Bajo stock
- `POST /api/productos` - Crear
- `PUT /api/productos/{id}` - Actualizar
- `DELETE /api/productos/{id}` - Eliminar
- `PATCH /api/productos/{id}/stock` - Actualizar stock

### Órdenes
- `GET /api/ordenes` - Listar todas
- `GET /api/ordenes/{id}` - Obtener por ID
- `GET /api/ordenes/cliente/{idCliente}` - Por cliente
- `GET /api/ordenes/fecha/{fecha}` - Por fecha
- `GET /api/ordenes/{id}/items` - Items de orden
- `GET /api/ordenes/{id}/total` - Total de orden
- `POST /api/ordenes` - Crear
- `DELETE /api/ordenes/{id}` - Eliminar

## Notas Importantes

1. **Todos los Resources usan:**
   - `@Path` para definir la ruta base
   - `@Produces(MediaType.APPLICATION_JSON)` para respuestas JSON
   - `@Consumes(MediaType.APPLICATION_JSON)` para recibir JSON
   - `@Inject` para inyección de dependencias de los servicios

2. **Códigos de respuesta HTTP:**
   - `200 OK` - Operaciones exitosas (GET, PUT)
   - `201 Created` - Creación exitosa (POST)
   - `204 No Content` - Eliminación exitosa (DELETE)
   - `404 Not Found` - Recurso no encontrado
   - `500 Internal Server Error` - Error del servidor

3. **CORS está configurado** en `application.properties` para permitir peticiones desde el frontend

4. **Validaciones** se manejan en la capa de servicio

5. **Excepciones** se capturan con el `GlobalExceptionHandler`