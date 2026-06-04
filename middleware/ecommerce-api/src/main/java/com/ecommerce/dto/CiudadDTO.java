// src/main/java/com/ecommerce/dto/CiudadDTO.java
package com.ecommerce.dto;

public class CiudadDTO {
    private Long idCiudad;
    private Long idPais;
    private String ciudad;
    private PaisDTO pais;

    // Constructors
    public CiudadDTO() {
    }

    public CiudadDTO(Long idCiudad, Long idPais, String ciudad) {
        this.idCiudad = idCiudad;
        this.idPais = idPais;
        this.ciudad = ciudad;
    }

    // Getters and Setters
    public Long getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(Long idCiudad) {
        this.idCiudad = idCiudad;
    }

    public Long getIdPais() {
        return idPais;
    }

    public void setIdPais(Long idPais) {
        this.idPais = idPais;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public PaisDTO getPais() {
        return pais;
    }

    public void setPais(PaisDTO pais) {
        this.pais = pais;
    }
}
