package com.ecommerce.repository;

import com.ecommerce.entity.Ciudad;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class CiudadRepository implements PanacheRepository<Ciudad> {
    
    public List<Ciudad> findByPaisId(Long idPais) {
        return list("pais.idPais", idPais);
    }
    
    public boolean existsByCiudadAndPaisId(String ciudad, Long idPais) {
        return count("ciudad = ?1 and pais.idPais = ?2", ciudad, idPais) > 0;
    }
}
