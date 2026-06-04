// src/main/java/com/ecommerce/dto/OrdenItemDTO.java
package com.ecommerce.dto;

public class OrdenItemDTO {
    private Long idOrden;
    private Long idProducto;
    private Double precioVenta;
    private ProductoDTO producto;

    // Constructors
    public OrdenItemDTO() {
    }

    public OrdenItemDTO(Long idOrden, Long idProducto, Double precioVenta) {
        this.idOrden = idOrden;
        this.idProducto = idProducto;
        this.precioVenta = precioVenta;
    }

    // Getters and Setters
    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

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

    public ProductoDTO getProducto() {
        return producto;
    }

    public void setProducto(ProductoDTO producto) {
        this.producto = producto;
    }
}
