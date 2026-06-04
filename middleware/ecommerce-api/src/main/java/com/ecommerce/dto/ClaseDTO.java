// src/main/java/com/ecommerce/dto/ClaseDTO.java
package com.ecommerce.dto;

public class ClaseDTO {
    private Long idTipo;
    private String nombre;

    // Constructors
    public ClaseDTO() {
    }

    public ClaseDTO(Long idTipo, String nombre) {
        this.idTipo = idTipo;
        this.nombre = nombre;
    }

    // Getters and Setters
    public Long getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(Long idTipo) {
        this.idTipo = idTipo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
