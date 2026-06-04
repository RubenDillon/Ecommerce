package com.ecommerce.repository;

import com.ecommerce.entity.Orden;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class OrdenRepository implements PanacheRepository<Orden> {
    
    public List<Orden> findByClienteId(Long idCliente) {
        return list("cliente.idCliente", idCliente);
    }
    
    public List<Orden> findRecientes(int limit) {
        return find("ORDER BY fecha DESC").page(0, limit).list();
    }
}
