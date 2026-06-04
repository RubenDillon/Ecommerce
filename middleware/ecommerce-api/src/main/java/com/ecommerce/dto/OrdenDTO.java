package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private String nombreCliente;
    private LocalDateTime fecha;
    private List<ItemDTO> items;
    private BigDecimal total;
    private Integer cantidadItems;
}
