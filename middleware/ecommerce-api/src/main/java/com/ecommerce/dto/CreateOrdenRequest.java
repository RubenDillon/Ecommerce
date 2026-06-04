// src/main/java/com/ecommerce/dto/CreateOrdenRequest.java
package com.ecommerce.dto;

import java.util.List;

public class CreateOrdenRequest {
    private Long idCliente;
    private List<CreateOrdenItemRequest> items;

    // Constructors
    public CreateOrdenRequest() {
    }

    public CreateOrdenRequest(Long idCliente, List<CreateOrdenItemRequest> items) {
        this.idCliente = idCliente;
        this.items = items;
    }

    // Getters and Setters
    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public List<CreateOrdenItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateOrdenItemRequest> items) {
        this.items = items;
    }
}
