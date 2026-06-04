package com.ecommerce.service;

import com.ecommerce.dto.PaisDTO;
import com.ecommerce.entity.Pais;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.PaisMapper;
import com.ecommerce.repository.PaisRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class PaisService {
    
    @Inject
    PaisRepository paisRepository;
    
    @Inject
    PaisMapper paisMapper;
    
    public List<PaisDTO> findAll() {
        return paisMapper.toDTOList(paisRepository.listAll());
    }
    
    public PaisDTO findById(Long id) {
        Pais pais = paisRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("País", "id", id));
        return paisMapper.toDTO(pais);
    }
    
    @Transactional
    public PaisDTO create(PaisDTO dto) {
        if (paisRepository.existsByNombre(dto.getNombre())) {
            throw new BusinessException("Ya existe un país con el nombre: " + dto.getNombre());
        }
        
        Pais pais = paisMapper.toEntity(dto);
        paisRepository.persist(pais);
        return paisMapper.toDTO(pais);
    }
    
    @Transactional
    public PaisDTO update(Long id, PaisDTO dto) {
        Pais pais = paisRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("País", "id", id));
        
        if (!pais.getNombre().equals(dto.getNombre()) && 
            paisRepository.existsByNombre(dto.getNombre())) {
            throw new BusinessException("Ya existe un país con el nombre: " + dto.getNombre());
        }
        
        pais.setNombre(dto.getNombre());
        return paisMapper.toDTO(pais);
    }
    
    @Transactional
    public void delete(Long id) {
        Pais pais = paisRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("País", "id", id));
        
        if (!pais.getCiudades().isEmpty()) {
            throw new BusinessException("No se puede eliminar el país porque tiene ciudades asociadas");
        }
        
        if (!pais.getClientes().isEmpty()) {
            throw new BusinessException("No se puede eliminar el país porque tiene clientes asociados");
        }
        
        paisRepository.delete(pais);
    }
}
