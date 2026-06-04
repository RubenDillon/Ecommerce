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
