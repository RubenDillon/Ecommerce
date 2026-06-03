package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA para la tabla Ciudades
 * Representa las ciudades de cada país
 */
@Entity
@Table(name = "Ciudades", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"Ciudad", "IdPais"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ciudad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdCiudad")
    private Long idCiudad;

    @NotBlank(message = "El nombre de la ciudad es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(name = "Ciudad", nullable = false, length = 50)
    private String ciudad;

    @NotNull(message = "El país es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdPais", nullable = false)
    @JsonBackReference("pais-ciudades")
    private Pais pais;

    @OneToMany(mappedBy = "ciudad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("ciudad-clientes")
    private List<Cliente> clientes = new ArrayList<>();
}

// Made with Bob
