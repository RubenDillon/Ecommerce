package com.ecommerce.service;

import com.ecommerce.dto.ClaseDTO;
import com.ecommerce.entity.Clase;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.ClaseMapper;
import com.ecommerce.repository.ClaseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ClaseService {
    
    @Inject
    ClaseRepository claseRepository;
    
    @Inject
    ClaseMapper claseMapper;
    
    public List<ClaseDTO> findAll() {
        return claseMapper.toDTOList(claseRepository.listAll());
    }
    
    public ClaseDTO findById(Long id) {
        Clase clase = claseRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Clase", "id", id));
        return claseMapper.toDTO(clase);
    }
    
    @Transactional
    public ClaseDTO create(ClaseDTO dto) {
        if (claseRepository.existsByNombre(dto.getNombre())) {
            throw new BusinessException("Ya existe una clase con el nombre: " + dto.getNombre());
        }
        
        Clase clase = claseMapper.toEntity(dto);
        claseRepository.persist(clase);
        return claseMapper.toDTO(clase);
    }
    
    @Transactional
    public ClaseDTO update(Long id, ClaseDTO dto) {
        Clase clase = claseRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Clase", "id", id));
        
        if (!clase.getNombre().equals(dto.getNombre()) && 
            claseRepository.existsByNombre(dto.getNombre())) {
            throw new BusinessException("Ya existe una clase con el nombre: " + dto.getNombre());
        }
        
        clase.setNombre(dto.getNombre());
        return claseMapper.toDTO(clase);
    }
    
    @Transactional
    public void delete(Long id) {
        Clase clase = claseRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Clase", "id", id));
        
        if (!clase.getProductos().isEmpty()) {
            throw new BusinessException("No se puede eliminar la clase porque tiene productos asociados");
        }
        
        claseRepository.delete(clase);
    }
}
