package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA para la tabla Ordenes
 * Representa las órdenes de compra de los clientes
 */
@Entity
@Table(name = "Ordenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdOrden")
    private Long idOrden;

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdCliente", nullable = false)
    @JsonBackReference("cliente-ordenes")
    private Cliente cliente;

    @Column(name = "Fecha", nullable = false, updatable = false)
    private LocalDateTime fecha;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference("orden-items")
    private List<Item> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
    }

    /**
     * Calcula el total de la orden sumando todos los items
     */
    public BigDecimal getTotal() {
        return items.stream()
                .map(Item::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Obtiene la cantidad total de items en la orden
     */
    public Integer getCantidadItems() {
        return items.stream()
                .mapToInt(Item::getCantidad)
                .sum();
    }

    /**
     * Agrega un item a la orden
     */
    public void agregarItem(Item item) {
        items.add(item);
        item.setOrden(this);
    }

    /**
     * Elimina un item de la orden
     */
    public void eliminarItem(Item item) {
        items.remove(item);
        item.setOrden(null);
    }
}

// Made with Bob
