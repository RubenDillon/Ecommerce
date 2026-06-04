package com.ecommerce.repository;

import com.ecommerce.entity.Item;
import com.ecommerce.entity.ItemId;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ItemRepository implements PanacheRepositoryBase<Item, ItemId> {
    
    public List<Item> findByOrdenId(Long idOrden) {
        return list("orden.idOrden", idOrden);
    }
    
    public List<Item> findByProductoId(Long idProducto) {
        return list("producto.idProducto", idProducto);
    }
}
