package com.ecommerce.repository;

import com.ecommerce.entity.Cliente;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ClienteRepository implements PanacheRepository<Cliente> {
    
    public Optional<Cliente> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
    
    public List<Cliente> findByPaisId(Long idPais) {
        return list("pais.idPais", idPais);
    }
    
    public List<Cliente> findByCiudadId(Long idCiudad) {
        return list("ciudad.idCiudad", idCiudad);
    }
    
    public boolean existsByEmail(String email) {
        return count("email", email) > 0;
    }
}
