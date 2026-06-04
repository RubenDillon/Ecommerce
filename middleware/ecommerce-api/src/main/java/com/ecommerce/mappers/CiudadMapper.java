package com.ecommerce.mapper;

import com.ecommerce.dto.CiudadDTO;
import com.ecommerce.entity.Ciudad;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface CiudadMapper {
    
    @Mapping(source = "pais.idPais", target = "idPais")
    @Mapping(source = "pais.nombre", target = "nombrePais")
    CiudadDTO toDTO(Ciudad ciudad);
    
    @Mapping(target = "pais", ignore = true)
    @Mapping(target = "clientes", ignore = true)
    Ciudad toEntity(CiudadDTO dto);
    
    List<CiudadDTO> toDTOList(List<Ciudad> ciudades);
}
