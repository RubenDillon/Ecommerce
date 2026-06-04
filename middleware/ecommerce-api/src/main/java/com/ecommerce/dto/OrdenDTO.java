// src/main/java/com/ecommerce/dto/OrdenDTO.java
package com.ecommerce.dto;

import java.time.LocalDate;
import java.util.List;

public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private LocalDate fecha;
    private ClienteDTO cliente;
    private List<OrdenItemDTO> items;

    // Constructors
    public OrdenDTO() {
    }

    // Getters and Setters
    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public List<OrdenItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrdenItemDTO> items) {
        this.items = items;
    }
}
