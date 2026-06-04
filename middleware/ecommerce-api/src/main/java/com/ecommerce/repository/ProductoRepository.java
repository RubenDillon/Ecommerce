package com.ecommerce.repository;

import com.ecommerce.entity.Producto;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductoRepository implements PanacheRepository<Producto> {
    
    public Optional<Producto> findBySku(Integer sku) {
        return find("sku", sku).firstResultOptional();
    }
    
    public List<Producto> findByClaseId(Long idTipo) {
        return list("clase.idTipo", idTipo);
    }
    
    public List<Producto> findDisponibles() {
        return list("stock > 0");
    }
    
    public boolean existsBySku(Integer sku) {
        return count("sku", sku) > 0;
    }
}
