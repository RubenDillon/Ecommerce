package com.ecommerce.service;

import com.ecommerce.dto.ClienteDTO;
import com.ecommerce.entity.Ciudad;
import com.ecommerce.entity.Cliente;
import com.ecommerce.entity.Pais;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.ClienteMapper;
import com.ecommerce.repository.CiudadRepository;
import com.ecommerce.repository.ClienteRepository;
import com.ecommerce.repository.PaisRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ClienteService {
    
    @Inject
    ClienteRepository clienteRepository;
    
    @Inject
    PaisRepository paisRepository;
    
    @Inject
    CiudadRepository ciudadRepository;
    
    @Inject
    ClienteMapper clienteMapper;
    
    public List<ClienteDTO> findAll() {
        return clienteMapper.toDTOList(clienteRepository.listAll());
    }
    
    public ClienteDTO findById(Long id) {
        Cliente cliente = clienteRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
        return clienteMapper.toDTO(cliente);
    }
    
    public ClienteDTO findByEmail(String email) {
        Cliente cliente = clienteRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "email", email));
        return clienteMapper.toDTO(cliente);
    }
    
    public List<ClienteDTO> findByPaisId(Long idPais) {
        return clienteMapper.toDTOList(clienteRepository.findByPaisId(idPais));
    }
    
    public List<ClienteDTO> findByCiudadId(Long idCiudad) {
        return clienteMapper.toDTOList(clienteRepository.findByCiudadId(idCiudad));
    }
    
    @Transactional
    public ClienteDTO create(ClienteDTO dto) {
        if (dto.getEmail() != null && clienteRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Ya existe un cliente con el email: " + dto.getEmail());
        }
        
        Pais pais = paisRepository.findByIdOptional(dto.getIdPais())
            .orElseThrow(() -> new ResourceNotFoundException("País", "id", dto.getIdPais()));
        
        Ciudad ciudad = ciudadRepository.findByIdOptional(dto.getIdCiudad())
            .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", dto.getIdCiudad()));
        
        if (!ciudad.getPais().getIdPais().equals(pais.getIdPais())) {
            throw new BusinessException("La ciudad seleccionada no pertenece al país seleccionado");
        }
        
        Cliente cliente = clienteMapper.toEntity(dto);
        cliente.setPais(pais);
        cliente.setCiudad(ciudad);
        clienteRepository.persist(cliente);
        return clienteMapper.toDTO(cliente);
    }
    
    @Transactional
    public ClienteDTO update(Long id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
        
        if (dto.getEmail() != null && !dto.getEmail().equals(cliente.getEmail()) &&
            clienteRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Ya existe un cliente con el email: " + dto.getEmail());
        }
        
        if (dto.getIdPais() != null) {
            Pais pais = paisRepository.findByIdOptional(dto.getIdPais())
                .orElseThrow(() -> new ResourceNotFoundException("País", "id", dto.getIdPais()));
            cliente.setPais(pais);
        }
        
        if (dto.getIdCiudad() != null) {
            Ciudad ciudad = ciudadRepository.findByIdOptional(dto.getIdCiudad())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", dto.getIdCiudad()));
            cliente.setCiudad(ciudad);
        }
        
        cliente.setNombre(dto.getNombre());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        
        return clienteMapper.toDTO(cliente);
    }
    
    @Transactional
    public void delete(Long id) {
        Cliente cliente = clienteRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
        clienteRepository.delete(cliente);
    }
}
