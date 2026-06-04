package com.ecommerce.service;

import com.ecommerce.dto.CrearOrdenDTO;
import com.ecommerce.dto.ItemDTO;
import com.ecommerce.dto.OrdenDTO;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.ItemMapper;
import com.ecommerce.mapper.OrdenMapper;
import com.ecommerce.repository.ClienteRepository;
import com.ecommerce.repository.ItemRepository;
import com.ecommerce.repository.OrdenRepository;
import com.ecommerce.repository.ProductoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class OrdenService {
    
    @Inject
    OrdenRepository ordenRepository;
    
    @Inject
    ClienteRepository clienteRepository;
    
    @Inject
    ProductoRepository productoRepository;
    
    @Inject
    ItemRepository itemRepository;
    
    @Inject
    OrdenMapper ordenMapper;
    
    @Inject
    ItemMapper itemMapper;
    
    public List<OrdenDTO> findAll() {
        return ordenMapper.toDTOList(ordenRepository.listAll());
    }
    
    public OrdenDTO findById(Long id) {
        Orden orden = ordenRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Orden", "id", id));
        return ordenMapper.toDTO(orden);
    }
    
    public List<OrdenDTO> findByClienteId(Long idCliente) {
        return ordenMapper.toDTOList(ordenRepository.findByClienteId(idCliente));
    }
    
    public List<ItemDTO> findItemsByOrdenId(Long idOrden) {
        return itemMapper.toDTOList(itemRepository.findByOrdenId(idOrden));
    }
    
    @Transactional
    public OrdenDTO create(CrearOrdenDTO dto) {
        Cliente cliente = clienteRepository.findByIdOptional(dto.getIdCliente())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", dto.getIdCliente()));
        
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new BusinessException("La orden debe tener al menos un item");
        }
        
        Orden orden = new Orden();
        orden.setCliente(cliente);
        ordenRepository.persist(orden);
        
        for (CrearOrdenDTO.ItemOrdenDTO itemDTO : dto.getItems()) {
            Producto producto = productoRepository.findByIdOptional(itemDTO.getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", itemDTO.getIdProducto()));
            
            if (!producto.tieneSuficienteStock(itemDTO.getCantidad())) {
                throw new BusinessException("Stock insuficiente para el producto: " + producto.getNombre());
            }
            
            Item item = new Item();
            item.setId(new ItemId(orden.getIdOrden(), producto.getIdProducto()));
            item.setOrden(orden);
            item.setProducto(producto);
            item.setPrecioVenta(producto.getValorVenta());
            item.setCantidad(itemDTO.getCantidad());
            
            producto.reducirStock(itemDTO.getCantidad());
            
            orden.agregarItem(item);
            itemRepository.persist(item);
        }
        
        return ordenMapper.toDTO(orden);
    }
    
    @Transactional
    public void delete(Long id) {
        Orden orden = ordenRepository.findByIdOptional(id)
            .orElseThrow(() -> new ResourceNotFoundException("Orden", "id", id));
        
        for (Item item : orden.getItems()) {
            item.getProducto().aumentarStock(item.getCantidad());
        }
        
        ordenRepository.delete(orden);
    }
}
