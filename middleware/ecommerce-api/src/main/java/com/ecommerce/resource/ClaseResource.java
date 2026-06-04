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
