package com.ecommerce.mapper;

import com.ecommerce.dto.ClaseDTO;
import com.ecommerce.entity.Clase;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ClaseMapper {
    
    ClaseDTO toDTO(Clase clase);
    
    Clase toEntity(ClaseDTO dto);
    
    List<ClaseDTO> toDTOList(List<Clase> clases);
}
