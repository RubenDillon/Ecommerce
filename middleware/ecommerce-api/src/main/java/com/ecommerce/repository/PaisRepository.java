package com.ecommerce.repository;

import com.ecommerce.entity.Pais;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class PaisRepository implements PanacheRepository<Pais> {
    
    public Optional<Pais> findByNombre(String nombre) {
        return find("nombre", nombre).firstResultOptional();
    }
    
    public boolean existsByNombre(String nombre) {
        return count("nombre", nombre) > 0;
    }
}
