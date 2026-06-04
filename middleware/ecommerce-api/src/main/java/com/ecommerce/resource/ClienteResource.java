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
    public Response search(@QueryParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return Response.ok(clienteService.findAll()).build();
        }
        try {
            ClienteDTO cliente = clienteService.findByEmail(query);
            return Response.ok(cliente).build();
        } catch (Exception e) {
            return Response.ok(java.util.Collections.emptyList()).build();
        }
    }

    @GET
    @Path("/pais/{idPais}")
    public List<ClienteDTO> getByPais(@PathParam("idPais") Long idPais) {
        return clienteService.findByPaisId(idPais);
    }

    @GET
    @Path("/ciudad/{idCiudad}")
    public List<ClienteDTO> getByCiudad(@PathParam("idCiudad") Long idCiudad) {
        return clienteService.findByCiudadId(idCiudad);
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
