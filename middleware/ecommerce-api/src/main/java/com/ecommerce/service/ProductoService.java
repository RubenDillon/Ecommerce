package com.ecommerce.service;

import com.ecommerce.dto.ProductoDTO;
import com.ecommerce.entity.Clase;
import com.ecommerce.entity.Producto;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.ProductoMapper;
import com.ecommerce.repository.ClaseRepository;
import com.ecommerce.repository.ProductoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ProductoService {
    
    @Inject
    ProductoRepository productoRepository;
    
    @Inject
    ClaseRepository claseRepository;
    
    @Inject
    ProductoMapper productoMapper;
    
    public List<ProductoDTO> findAll() {
        return productoMapper.toDTOList(productoRepository.listAll());
    }
    
    public ProductoDTO findById(Long id) {
        Producto producto = productoRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return productoMapper.toDTO(producto);
    }
    
    public ProductoDTO findBySku(Integer sku) {
        Producto producto = productoRepository.findBySku(sku)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "SKU", sku));
        return productoMapper.toDTO(producto);
    }
    
    public List<ProductoDTO> findByClaseId(Long idTipo) {
        return productoMapper.toDTOList(productoRepository.findByClaseId(idTipo));
    }
    
    public List<ProductoDTO> findDisponibles() {
        return productoMapper.toDTOList(productoRepository.findDisponibles());
    }
    
    @Transactional
    public ProductoDTO create(ProductoDTO dto) {
        if (productoRepository.existsBySku(dto.getSku())) {
            throw new BusinessException("Ya existe un producto con el SKU: " + dto.getSku());
        }
        
        Clase clase = claseRepository.findByIdOptional(dto.getIdTipo())
            .orElseThrow(() -> new ResourceNotFoundException("Clase", "id", dto.getIdTipo()));
        
        Producto producto = productoMapper.toEntity(dto);
        producto.setClase(clase);
        productoRepository.persist(producto);
        return productoMapper.toDTO(producto);
    }
    
    @Transactional
    public ProductoDTO update(Long id, ProductoDTO dto) {
        Producto producto = productoRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        if (!producto.getSku().equals(dto.getSku()) && 
            productoRepository.existsBySku(dto.getSku())) {
            throw new BusinessException("Ya existe un producto con el SKU: " + dto.getSku());
        }
        
        if (dto.getIdTipo() != null && !producto.getClase().getIdTipo().equals(dto.getIdTipo())) {
            Clase clase = claseRepository.findByIdOptional(dto.getIdTipo())
                .orElseThrow(() -> new ResourceNotFoundException("Clase", "id", dto.getIdTipo()));
            producto.setClase(clase);
        }
        
        producto.setNombre(dto.getNombre());
        producto.setSku(dto.getSku());
        producto.setStock(dto.getStock());
        producto.setFoto(dto.getFoto());
        producto.setValorCosto(dto.getValorCosto());
        producto.setValorVenta(dto.getValorVenta());
        
        return productoMapper.toDTO(producto);
    }
    
    @Transactional
    public ProductoDTO updateStock(Long id, Integer nuevoStock) {
        Producto producto = productoRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        if (nuevoStock < 0) {
            throw new BusinessException("El stock no puede ser negativo");
        }
        
        producto.setStock(nuevoStock);
        return productoMapper.toDTO(producto);
    }
    
    @Transactional
    public void delete(Long id) {
        Producto producto = productoRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        if (!producto.getItems().isEmpty()) {
            throw new BusinessException("No se puede eliminar el producto porque está en órdenes");
        }
        
        productoRepository.delete(producto);
    }
}
