// src/main/java/com/ecommerce/dto/ProductoDTO.java
package com.ecommerce.dto;

public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Long sku;
    private Long idTipo;
    private Integer stock;
    private String foto;
    private Double valorCosto;
    private Double valorVenta;
    private ClaseDTO clase;

    // Constructors
    public ProductoDTO() {
    }

    // Getters and Setters
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getSku() {
        return sku;
    }

    public void setSku(Long sku) {
        this.sku = sku;
    }

    public Long getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(Long idTipo) {
        this.idTipo = idTipo;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Double getValorCosto() {
        return valorCosto;
    }

    public void setValorCosto(Double valorCosto) {
        this.valorCosto = valorCosto;
    }

    public Double getValorVenta() {
        return valorVenta;
    }

    public void setValorVenta(Double valorVenta) {
        this.valorVenta = valorVenta;
    }

    public ClaseDTO getClase() {
        return clase;
    }

    public void setClase(ClaseDTO clase) {
        this.clase = clase;
    }
}
