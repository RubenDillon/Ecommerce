package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Entidad JPA para la tabla Items
 * Representa los items/productos de cada orden
 */
@Entity
@Table(name = "Items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @EmbeddedId
    private ItemId id;

    @NotNull(message = "La orden es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idOrden")
    @JoinColumn(name = "IdOrden", nullable = false)
    @JsonBackReference("orden-items")
    private Orden orden;

    @NotNull(message = "El producto es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idProducto")
    @JoinColumn(name = "IdProducto", nullable = false)
    @JsonBackReference("producto-items")
    private Producto producto;

    @NotNull(message = "El precio de venta es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio de venta debe ser mayor a 0")
    @Column(name = "PrecioVenta", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioVenta;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    @Column(name = "Cantidad", nullable = false)
    private Integer cantidad = 1;

    /**
     * Constructor de conveniencia
     */
    public Item(Orden orden, Producto producto, BigDecimal precioVenta, Integer cantidad) {
        this.id = new ItemId(orden.getIdOrden(), producto.getIdProducto());
        this.orden = orden;
        this.producto = producto;
        this.precioVenta = precioVenta;
        this.cantidad = cantidad;
    }

    /**
     * Calcula el subtotal del item (precio * cantidad)
     */
    public BigDecimal getSubtotal() {
        if (precioVenta == null || cantidad == null) {
            return BigDecimal.ZERO;
        }
        return precioVenta.multiply(BigDecimal.valueOf(cantidad));
    }

    /**
     * Actualiza la cantidad del item
     */
    public void actualizarCantidad(Integer nuevaCantidad) {
        if (nuevaCantidad < 1) {
            throw new IllegalArgumentException("La cantidad debe ser al menos 1");
        }
        this.cantidad = nuevaCantidad;
    }
}

// Made with Bob
