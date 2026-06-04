package com.ecommerce.mapper;

import com.ecommerce.dto.ItemDTO;
import com.ecommerce.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ItemMapper {
    
    @Mapping(source = "id.idOrden", target = "idOrden")
    @Mapping(source = "id.idProducto", target = "idProducto")
    @Mapping(source = "producto.nombre", target = "nombreProducto")
    @Mapping(expression = "java(item.getSubtotal())", target = "subtotal")
    ItemDTO toDTO(Item item);
    
    List<ItemDTO> toDTOList(List<Item> items);
}
