// src/main/java/com/ecommerce/resource/OrdenResource.java
package com.ecommerce.resource;

import com.ecommerce.dto.CrearOrdenDTO;
import com.ecommerce.dto.ItemDTO;
import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.service.OrdenService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
        return ordenService.findByClienteId(idCliente);
    }

    @GET
    @Path("/{id}/items")
    public List<ItemDTO> getItems(@PathParam("id") Long id) {
        return ordenService.findItemsByOrdenId(id);
    }

    @POST
    public Response create(CrearOrdenDTO request) {
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
