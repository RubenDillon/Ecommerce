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
