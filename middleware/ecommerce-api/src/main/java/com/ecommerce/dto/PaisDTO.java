// src/main/java/com/ecommerce/dto/PaisDTO.java
package com.ecommerce.dto;

public class PaisDTO {
    private Long idPais;
    private String nombre;

    // Constructors
    public PaisDTO() {
    }

    public PaisDTO(Long idPais, String nombre) {
        this.idPais = idPais;
        this.nombre = nombre;
    }

    // Getters and Setters
    public Long getIdPais() {
        return idPais;
    }

    public void setIdPais(Long idPais) {
        this.idPais = idPais;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
