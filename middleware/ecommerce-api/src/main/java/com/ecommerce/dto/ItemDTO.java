package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {
    private Long idOrden;
    private Long idProducto;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioVenta;
    private BigDecimal subtotal;
}
