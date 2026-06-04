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
