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
