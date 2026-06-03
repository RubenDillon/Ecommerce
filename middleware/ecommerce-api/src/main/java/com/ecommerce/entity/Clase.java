package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA para la tabla Clases
 * Representa las categorías/tipos de productos
 */
@Entity
@Table(name = "Clases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdTipo")
    private Long idTipo;

    @NotBlank(message = "El nombre de la clase es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(name = "Nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @OneToMany(mappedBy = "clase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("clase-productos")
    private List<Producto> productos = new ArrayList<>();
}

// Made with Bob
