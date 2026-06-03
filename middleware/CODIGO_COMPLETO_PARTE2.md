# Código Completo del Middleware - Parte 2
## Servicios y Recursos REST

---

## 💼 Servicios de Negocio

### PaisService.java

```java
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
```

### CiudadService.java

```java
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
```

### ClienteService.java

```java
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
```

### ClaseService.java

```java
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
```

### ProductoService.java

```java
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
```

### OrdenService.java

```java
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
```

---

**Continúa con los Resources REST...**