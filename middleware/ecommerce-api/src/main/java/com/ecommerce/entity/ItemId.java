package com.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clase de clave compuesta para la entidad Item
 * Representa la clave primaria compuesta (IdOrden, IdProducto)
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemId implements Serializable {

    @Column(name = "IdOrden")
    private Long idOrden;

    @Column(name = "IdProducto")
    private Long idProducto;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemId itemId = (ItemId) o;
        return Objects.equals(idOrden, itemId.idOrden) &&
               Objects.equals(idProducto, itemId.idProducto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idOrden, idProducto);
    }
}

// Made with Bob
