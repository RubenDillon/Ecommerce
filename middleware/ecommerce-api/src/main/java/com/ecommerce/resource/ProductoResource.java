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
