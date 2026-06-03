package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA para la tabla Clientes
 * Representa los clientes del sistema
 */
@Entity
@Table(name = "Clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdCliente")
    private Long idCliente;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;

    @Size(max = 50, message = "La dirección no puede exceder 50 caracteres")
    @Column(name = "Direccion", length = 50)
    private String direccion;

    @NotNull(message = "La ciudad es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdCiudad", nullable = false)
    @JsonBackReference("ciudad-clientes")
    private Ciudad ciudad;

    @NotNull(message = "El país es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdPais", nullable = false)
    @JsonBackReference("pais-clientes")
    private Pais pais;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(name = "Telefono", length = 20)
    private String telefono;

    @Email(message = "El email debe tener un formato válido")
    @Size(max = 50, message = "El email no puede exceder 50 caracteres")
    @Column(name = "Email", length = 50)
    private String email;

    @Column(name = "FechaRegistro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference("cliente-ordenes")
    private List<Orden> ordenes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
}

// Made with Bob
