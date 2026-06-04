package com.ecommerce.mapper;

import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.entity.Orden;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI, uses = {ItemMapper.class})
public interface OrdenMapper {
    
    @Mapping(source = "cliente.idCliente", target = "idCliente")
    @Mapping(source = "cliente.nombre", target = "nombreCliente")
    @Mapping(expression = "java(orden.getTotal())", target = "total")
    @Mapping(expression = "java(orden.getCantidadItems())", target = "cantidadItems")
    OrdenDTO toDTO(Orden orden);
    
    List<OrdenDTO> toDTOList(List<Orden> ordenes);
}
