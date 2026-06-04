package com.ecommerce.mapper;

import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ProductoMapper {
    
    @Mapping(source = "clase.idTipo", target = "idTipo")
    @Mapping(source = "clase.nombre", target = "nombreClase")
    ProductoDTO toDTO(Producto producto);
    
    @Mapping(target = "clase", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    Producto toEntity(ProductoDTO dto);
    
    List<ProductoDTO> toDTOList(List<Producto> productos);
}
