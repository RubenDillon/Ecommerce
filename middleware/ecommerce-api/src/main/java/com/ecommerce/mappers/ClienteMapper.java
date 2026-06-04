package com.ecommerce.mapper;

import com.ecommerce.dto.ClienteDTO;
import com.ecommerce.entity.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface ClienteMapper {
    
    @Mapping(source = "ciudad.idCiudad", target = "idCiudad")
    @Mapping(source = "ciudad.ciudad", target = "nombreCiudad")
    @Mapping(source = "pais.idPais", target = "idPais")
    @Mapping(source = "pais.nombre", target = "nombrePais")
    ClienteDTO toDTO(Cliente cliente);
    
    @Mapping(target = "ciudad", ignore = true)
    @Mapping(target = "pais", ignore = true)
    @Mapping(target = "ordenes", ignore = true)
    @Mapping(target = "fechaRegistro", ignore = true)
    Cliente toEntity(ClienteDTO dto);
    
    List<ClienteDTO> toDTOList(List<Cliente> clientes);
}
