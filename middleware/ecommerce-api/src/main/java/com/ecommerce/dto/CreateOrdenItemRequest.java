// src/main/java/com/ecommerce/dto/CreateOrdenItemRequest.java
package com.ecommerce.dto;

public class CreateOrdenItemRequest {
    private Long idProducto;
    private Double precioVenta;

    // Constructors
    public CreateOrdenItemRequest() {
    }

    public CreateOrdenItemRequest(Long idProducto, Double precioVenta) {
        this.idProducto = idProducto;
        this.precioVenta = precioVenta;
    }

    // Getters and Setters
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }
}
