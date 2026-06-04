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
        return ciudadService.findByPaisId(idPais);
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
