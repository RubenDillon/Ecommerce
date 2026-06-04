package com.ecommerce.mapper;

import com.ecommerce.dto.PaisDTO;
import com.ecommerce.entity.Pais;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface PaisMapper {
    
    PaisDTO toDTO(Pais pais);
    
    Pais toEntity(PaisDTO dto);
    
    List<PaisDTO> toDTOList(List<Pais> paises);
}
