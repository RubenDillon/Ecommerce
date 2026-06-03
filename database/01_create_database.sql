-- ============================================================================
-- Script de Creación de Base de Datos E-commerce
-- Servidor: 10.242.64.5
-- Base de Datos: ecommerce
-- ============================================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS ecommerce
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecommerce;

-- ============================================================================
-- TABLA: Pais
-- Almacena los países disponibles en el sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS Pais (
    IdPais INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_nombre_pais (Nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: Ciudades
-- Almacena las ciudades de cada país
-- ============================================================================
CREATE TABLE IF NOT EXISTS Ciudades (
    IdCiudad INT AUTO_INCREMENT PRIMARY KEY,
    IdPais INT NOT NULL,
    Ciudad VARCHAR(50) NOT NULL,
    CONSTRAINT fk_ciudades_pais 
        FOREIGN KEY (IdPais) 
        REFERENCES Pais(IdPais)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_idpais_ciudades (IdPais),
    INDEX idx_ciudad (Ciudad),
    UNIQUE KEY uk_ciudad_pais (Ciudad, IdPais)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: Clientes
-- Almacena información de los clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS Clientes (
    IdCliente INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Direccion VARCHAR(50),
    IdCiudad INT NOT NULL,
    IdPais INT NOT NULL,
    Telefono VARCHAR(20),
    Email VARCHAR(50),
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_clientes_ciudad 
        FOREIGN KEY (IdCiudad) 
        REFERENCES Ciudades(IdCiudad)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_clientes_pais 
        FOREIGN KEY (IdPais) 
        REFERENCES Pais(IdPais)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_nombre_cliente (Nombre),
    INDEX idx_email_cliente (Email),
    INDEX idx_idciudad_cliente (IdCiudad),
    INDEX idx_idpais_cliente (IdPais)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: Clases
-- Almacena los tipos/categorías de productos
-- ============================================================================
CREATE TABLE IF NOT EXISTS Clases (
    IdTipo INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_nombre_clase (Nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: Productos
-- Almacena el catálogo de productos
-- ============================================================================
CREATE TABLE IF NOT EXISTS Productos (
    IdProducto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    SKU INT NOT NULL UNIQUE,
    IdTipo INT NOT NULL,
    Stock INT DEFAULT 0 CHECK (Stock >= 0),
    Foto VARCHAR(500),
    Valor_costo DECIMAL(10,2) NOT NULL CHECK (Valor_costo >= 0),
    Valor_venta DECIMAL(10,2) NOT NULL CHECK (Valor_venta >= 0),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productos_clase 
        FOREIGN KEY (IdTipo) 
        REFERENCES Clases(IdTipo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_nombre_producto (Nombre),
    INDEX idx_sku (SKU),
    INDEX idx_idtipo_producto (IdTipo),
    INDEX idx_stock (Stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: Ordenes
-- Almacena las órdenes de compra
-- ============================================================================
CREATE TABLE IF NOT EXISTS Ordenes (
    IdOrden INT AUTO_INCREMENT PRIMARY KEY,
    IdCliente INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ordenes_cliente 
        FOREIGN KEY (IdCliente) 
        REFERENCES Clientes(IdCliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_idcliente_orden (IdCliente),
    INDEX idx_fecha_orden (Fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: Items
-- Almacena los items de cada orden
-- ============================================================================
CREATE TABLE IF NOT EXISTS Items (
    IdOrden INT NOT NULL,
    IdProducto INT NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL CHECK (PrecioVenta >= 0),
    Cantidad INT DEFAULT 1 CHECK (Cantidad > 0),
    PRIMARY KEY (IdOrden, IdProducto),
    CONSTRAINT fk_items_orden 
        FOREIGN KEY (IdOrden) 
        REFERENCES Ordenes(IdOrden)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_items_producto 
        FOREIGN KEY (IdProducto) 
        REFERENCES Productos(IdProducto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_idorden_item (IdOrden),
    INDEX idx_idproducto_item (IdProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Verificación de tablas creadas
-- ============================================================================
SHOW TABLES;

SELECT 
    TABLE_NAME,
    ENGINE,
    TABLE_ROWS,
    CREATE_TIME
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'ecommerce'
ORDER BY 
    TABLE_NAME;

-- Made with Bob
