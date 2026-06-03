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
 * Entidad JPA para la tabla Pais
 * Representa los países disponibles en el sistema
 */
@Entity
@Table(name = "Pais")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdPais")
    private Long idPais;

    @NotBlank(message = "El nombre del país es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(name = "Nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @OneToMany(mappedBy = "pais", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("pais-ciudades")
    private List<Ciudad> ciudades = new ArrayList<>();

    @OneToMany(mappedBy = "pais", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("pais-clientes")
    private List<Cliente> clientes = new ArrayList<>();
}

// Made with Bob
