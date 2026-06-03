package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA para la tabla Productos
 * Representa el catálogo de productos disponibles
 */
@Entity
@Table(name = "Productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdProducto")
    private Long idProducto;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;

    @NotNull(message = "El SKU es obligatorio")
    @Column(name = "SKU", nullable = false, unique = true)
    private Integer sku;

    @NotNull(message = "La clase/categoría es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdTipo", nullable = false)
    @JsonBackReference("clase-productos")
    private Clase clase;

    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(name = "Stock", nullable = false)
    private Integer stock = 0;

    @Size(max = 500, message = "La URL de la foto no puede exceder 500 caracteres")
    @Column(name = "Foto", length = 500)
    private String foto;

    @NotNull(message = "El valor de costo es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El valor de costo debe ser mayor a 0")
    @Column(name = "Valor_costo", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCosto;

    @NotNull(message = "El valor de venta es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El valor de venta debe ser mayor a 0")
    @Column(name = "Valor_venta", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorVenta;

    @Column(name = "FechaCreacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("producto-items")
    private List<Item> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    /**
     * Verifica si el producto tiene stock disponible
     */
    public boolean tieneStock() {
        return stock != null && stock > 0;
    }

    /**
     * Verifica si hay suficiente stock para una cantidad específica
     */
    public boolean tieneSuficienteStock(Integer cantidad) {
        return stock != null && stock >= cantidad;
    }

    /**
     * Reduce el stock del producto
     */
    public void reducirStock(Integer cantidad) {
        if (!tieneSuficienteStock(cantidad)) {
            throw new IllegalStateException("Stock insuficiente para el producto: " + nombre);
        }
        this.stock -= cantidad;
    }

    /**
     * Aumenta el stock del producto
     */
    public void aumentarStock(Integer cantidad) {
        this.stock += cantidad;
    }
}

// Made with Bob
