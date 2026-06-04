package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Integer sku;
    private Long idTipo;
    private String nombreClase;
    private Integer stock;
    private String foto;
    private BigDecimal valorCosto;
    private BigDecimal valorVenta;
    private LocalDateTime fechaCreacion;
}
