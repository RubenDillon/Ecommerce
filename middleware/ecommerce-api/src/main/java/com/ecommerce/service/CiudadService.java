package com.ecommerce.service;

import com.ecommerce.dto.CiudadDTO;
import com.ecommerce.entity.Ciudad;
import com.ecommerce.entity.Pais;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.CiudadMapper;
import com.ecommerce.repository.CiudadRepository;
import com.ecommerce.repository.PaisRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class CiudadService {
    
    @Inject
    CiudadRepository ciudadRepository;
    
    @Inject
    PaisRepository paisRepository;
    
    @Inject
    CiudadMapper ciudadMapper;
    
    public List<CiudadDTO> findAll() {
        return ciudadMapper.toDTOList(ciudadRepository.listAll());
    }
    
    public CiudadDTO findById(Long id) {
        Ciudad ciudad = ciudadRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", id));
        return ciudadMapper.toDTO(ciudad);
    }
    
    public List<CiudadDTO> findByPaisId(Long idPais) {
        return ciudadMapper.toDTOList(ciudadRepository.findByPaisId(idPais));
    }
    
    @Transactional
    public CiudadDTO create(CiudadDTO dto) {
        Pais pais = paisRepository.findByIdOptional(dto.getIdPais())
            .orElseThrow(() -> new ResourceNotFoundException("País", "id", dto.getIdPais()));
        
        if (ciudadRepository.existsByCiudadAndPaisId(dto.getCiudad(), dto.getIdPais())) {
            throw new BusinessException("Ya existe una ciudad con ese nombre en el país seleccionado");
        }
        
        Ciudad ciudad = ciudadMapper.toEntity(dto);
        ciudad.setPais(pais);
        ciudadRepository.persist(ciudad);
        return ciudadMapper.toDTO(ciudad);
    }
    
    @Transactional
    public CiudadDTO update(Long id, CiudadDTO dto) {
        Ciudad ciudad = ciudadRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", id));
        
        if (dto.getIdPais() != null && !ciudad.getPais().getIdPais().equals(dto.getIdPais())) {
            Pais pais = paisRepository.findByIdOptional(dto.getIdPais())
                .orElseThrow(() -> new ResourceNotFoundException("País", "id", dto.getIdPais()));
            ciudad.setPais(pais);
        }
        
        ciudad.setCiudad(dto.getCiudad());
        return ciudadMapper.toDTO(ciudad);
    }
    
    @Transactional
    public void delete(Long id) {
        Ciudad ciudad = ciudadRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", id));
        
        if (!ciudad.getClientes().isEmpty()) {
            throw new BusinessException("No se puede eliminar la ciudad porque tiene clientes asociados");
        }
        
        ciudadRepository.delete(ciudad);
    }
}
