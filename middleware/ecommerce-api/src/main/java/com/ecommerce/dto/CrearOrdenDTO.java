package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearOrdenDTO {
    private Long idCliente;
    private List<ItemOrdenDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemOrdenDTO {
        private Long idProducto;
        private Integer cantidad;
    }
}

