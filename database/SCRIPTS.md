# Scripts de Implementación - Backend MySQL

Este documento contiene todos los scripts necesarios para implementar el backend de la aplicación de e-commerce.

---

## 1. Script de Instalación de MySQL (install_mysql.sh)

```bash
#!/bin/bash

################################################################################
# Script de Instalación de MySQL en Red Hat Enterprise Linux 9
# Para aplicación E-commerce
# Servidor: 10.242.64.5
################################################################################

set -e  # Salir si hay algún error

echo "=========================================="
echo "Instalación de MySQL en RHEL 9"
echo "=========================================="

# Verificar que se ejecuta con privilegios sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Por favor ejecute este script con sudo"
    exit 1
fi

# Actualizar el sistema
echo "Actualizando el sistema..."
dnf update -y

# Instalar MySQL Server desde repositorios oficiales de Red Hat
echo "Instalando MySQL Server..."
dnf install -y mysql-server

# Habilitar e iniciar el servicio MySQL
echo "Habilitando y iniciando MySQL..."
systemctl enable mysqld
systemctl start mysqld

# Verificar el estado del servicio
systemctl status mysqld --no-pager

# Configurar firewall para permitir conexiones MySQL
echo "Configurando firewall..."
firewall-cmd --permanent --add-service=mysql
firewall-cmd --reload

# Mostrar versión instalada
mysql --version

echo "=========================================="
echo "MySQL instalado correctamente"
echo "=========================================="
echo ""
echo "Próximos pasos:"
echo "1. Ejecutar: sudo mysql_secure_installation"
echo "2. Ejecutar: ./configure_mysql.sh"
echo "3. Ejecutar scripts SQL de creación de base de datos"
```

---

## 2. Script de Configuración de MySQL (configure_mysql.sh)

```bash
#!/bin/bash

################################################################################
# Script de Configuración de MySQL para acceso remoto
# Servidor: 10.242.64.5
################################################################################

set -e

echo "=========================================="
echo "Configuración de MySQL para acceso remoto"
echo "=========================================="

# Verificar que se ejecuta con privilegios sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Por favor ejecute este script con sudo"
    exit 1
fi

# Solicitar contraseña root de MySQL
read -sp "Ingrese la contraseña root de MySQL: " MYSQL_ROOT_PASSWORD
echo ""

# Solicitar contraseña para el usuario de la aplicación
read -sp "Ingrese la contraseña para el usuario ecommerce_user: " APP_PASSWORD
echo ""

# Configurar MySQL para aceptar conexiones remotas
echo "Configurando MySQL para conexiones remotas..."

# Backup del archivo de configuración
cp /etc/my.cnf.d/mysql-server.cnf /etc/my.cnf.d/mysql-server.cnf.backup

# Modificar bind-address
cat >> /etc/my.cnf.d/mysql-server.cnf << EOF

[mysqld]
bind-address = 0.0.0.0
max_connections = 200
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
EOF

# Reiniciar MySQL
echo "Reiniciando MySQL..."
systemctl restart mysqld

# Crear usuario de aplicación y otorgar permisos
echo "Creando usuario de aplicación..."
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" << EOF
-- Crear usuario para la aplicación
CREATE USER IF NOT EXISTS 'ecommerce_user'@'%' IDENTIFIED BY '${APP_PASSWORD}';

-- Otorgar permisos sobre la base de datos ecommerce
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Mostrar usuarios
SELECT User, Host FROM mysql.user WHERE User = 'ecommerce_user';
EOF

echo "=========================================="
echo "Configuración completada"
echo "=========================================="
echo ""
echo "Información de conexión:"
echo "Host: 10.242.64.5"
echo "Puerto: 3306"
echo "Usuario: ecommerce_user"
echo "Base de datos: ecommerce"
echo ""
echo "Próximo paso: Ejecutar scripts SQL de creación de base de datos"
```

---

## 3. Script DDL - Creación de Base de Datos (01_create_database.sql)

```sql
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
```

---

## 4. Script de Datos Iniciales - Parte 1: Países y Ciudades (02_seed_data_part1.sql)

```sql
-- ============================================================================
-- Script de Datos Iniciales - Parte 1
-- Países y Ciudades
-- ============================================================================

USE ecommerce;

-- ============================================================================
-- INSERTAR PAÍSES
-- ============================================================================
INSERT INTO Pais (Nombre) VALUES
('Argentina'),
('Chile'),
('Uruguay'),
('Paraguay'),
('Brasil');

-- ============================================================================
-- INSERTAR CIUDADES - ARGENTINA
-- ============================================================================
INSERT INTO Ciudades (IdPais, Ciudad) VALUES
(1, 'Buenos Aires'),
(1, 'Córdoba'),
(1, 'Rosario'),
(1, 'Mendoza'),
(1, 'La Plata'),
(1, 'San Miguel de Tucumán'),
(1, 'Mar del Plata'),
(1, 'Salta'),
(1, 'Santa Fe'),
(1, 'San Juan');

-- ============================================================================
-- INSERTAR CIUDADES - CHILE
-- ============================================================================
INSERT INTO Ciudades (IdPais, Ciudad) VALUES
(2, 'Santiago'),
(2, 'Valparaíso'),
(2, 'Concepción'),
(2, 'La Serena'),
(2, 'Antofagasta'),
(2, 'Temuco'),
(2, 'Rancagua'),
(2, 'Talca'),
(2, 'Arica'),
(2, 'Puerto Montt');

-- ============================================================================
-- INSERTAR CIUDADES - URUGUAY
-- ============================================================================
INSERT INTO Ciudades (IdPais, Ciudad) VALUES
(3, 'Montevideo'),
(3, 'Salto'),
(3, 'Paysandú'),
(3, 'Las Piedras'),
(3, 'Rivera'),
(3, 'Maldonado'),
(3, 'Tacuarembó'),
(3, 'Melo'),
(3, 'Mercedes'),
(3, 'Artigas');

-- ============================================================================
-- INSERTAR CIUDADES - PARAGUAY
-- ============================================================================
INSERT INTO Ciudades (IdPais, Ciudad) VALUES
(4, 'Asunción'),
(4, 'Ciudad del Este'),
(4, 'San Lorenzo'),
(4, 'Luque'),
(4, 'Capiatá'),
(4, 'Lambaré'),
(4, 'Fernando de la Mora'),
(4, 'Limpio'),
(4, 'Ñemby'),
(4, 'Encarnación');

-- ============================================================================
-- INSERTAR CIUDADES - BRASIL
-- ============================================================================
INSERT INTO Ciudades (IdPais, Ciudad) VALUES
(5, 'São Paulo'),
(5, 'Rio de Janeiro'),
(5, 'Brasília'),
(5, 'Salvador'),
(5, 'Fortaleza'),
(5, 'Belo Horizonte'),
(5, 'Manaus'),
(5, 'Curitiba'),
(5, 'Recife'),
(5, 'Porto Alegre');

-- ============================================================================
-- Verificación de datos insertados
-- ============================================================================
SELECT 'Países insertados:' AS Info;
SELECT * FROM Pais;

SELECT 'Ciudades por país:' AS Info;
SELECT 
    p.Nombre AS Pais,
    COUNT(c.IdCiudad) AS CantidadCiudades
FROM 
    Pais p
    LEFT JOIN Ciudades c ON p.IdPais = c.IdPais
GROUP BY 
    p.IdPais, p.Nombre
ORDER BY 
    p.Nombre;
```

---

## 5. Script de Datos Iniciales - Parte 2: Clases de Productos (02_seed_data_part2.sql)

```sql
-- ============================================================================
-- Script de Datos Iniciales - Parte 2
-- Clases/Categorías de Productos
-- ============================================================================

USE ecommerce;

-- ============================================================================
-- INSERTAR CLASES DE PRODUCTOS
-- ============================================================================
INSERT INTO Clases (Nombre) VALUES
('Electrónica'),
('Indumentaria'),
('Electrodomésticos'),
('Productos de Belleza'),
('Deportes y Fitness'),
('Hogar y Decoración'),
('Juguetes y Juegos'),
('Libros y Papelería'),
('Alimentos y Bebidas'),
('Salud y Cuidado Personal'),
('Automotriz'),
('Herramientas y Ferretería'),
('Mascotas'),
('Bebés y Niños'),
('Música e Instrumentos'),
('Jardín y Exterior'),
('Oficina'),
('Tecnología Wearable'),
('Gaming'),
('Fotografía y Video');

-- ============================================================================
-- Verificación de datos insertados
-- ============================================================================
SELECT 'Clases de productos insertadas:' AS Info;
SELECT * FROM Clases ORDER BY IdTipo;
```

---

## 6. Script de Datos Iniciales - Parte 3: Productos (02_seed_data_part3.sql)

```sql
-- ============================================================================
-- Script de Datos Iniciales - Parte 3
-- Productos con imágenes y precios
-- ============================================================================

USE ecommerce;

-- ============================================================================
-- PRODUCTOS - ELECTRÓNICA (IdTipo = 1)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('PlayStation 5', 1001, 1, 25, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', 490000.00, 700000.00),
('Nintendo Switch OLED', 1002, 1, 30, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e', 350000.00, 500000.00),
('iPhone 15 Pro', 1003, 1, 15, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569', 910000.00, 1300000.00),
('Samsung Galaxy S24', 1004, 1, 20, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c', 630000.00, 900000.00),
('iPad Air', 1005, 1, 18, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', 560000.00, 800000.00);

-- ============================================================================
-- PRODUCTOS - INDUMENTARIA (IdTipo = 2)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Zapatillas Nike Air Max', 2001, 2, 50, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 105000.00, 150000.00),
('Zapatillas Reebok Classic', 2002, 2, 45, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', 70000.00, 100000.00),
('Remera Adidas Original', 2003, 2, 100, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 21000.00, 30000.00),
('Jean Levis 501', 2004, 2, 60, 'https://images.unsplash.com/photo-1542272604-787c3835535d', 56000.00, 80000.00),
('Campera North Face', 2005, 2, 35, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 140000.00, 200000.00);

-- ============================================================================
-- PRODUCTOS - ELECTRODOMÉSTICOS (IdTipo = 3)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Heladera Samsung 400L', 3001, 3, 12, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5', 420000.00, 600000.00),
('Lavarropas LG 8kg', 3002, 3, 15, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1', 350000.00, 500000.00),
('Microondas Whirlpool', 3003, 3, 25, 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d', 70000.00, 100000.00),
('Aire Acondicionado Split', 3004, 3, 10, 'https://images.unsplash.com/photo-1631545806609-c2f4e4e6e0e8', 280000.00, 400000.00),
('Aspiradora Robot Roomba', 3005, 3, 20, 'https://images.unsplash.com/photo-1558317374-067fb5f30001', 210000.00, 300000.00);

-- ============================================================================
-- PRODUCTOS - PRODUCTOS DE BELLEZA (IdTipo = 4)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Set Makeup MAC', 4001, 4, 40, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796', 35000.00, 50000.00),
('Perfume Chanel N°5', 4002, 4, 30, 'https://images.unsplash.com/photo-1541643600914-78b084683601', 140000.00, 200000.00),
('Crema Facial La Roche-Posay', 4003, 4, 50, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883', 28000.00, 40000.00),
('Shampoo Kerastase', 4004, 4, 60, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d', 21000.00, 30000.00),
('Serum Vitamina C', 4005, 4, 45, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 17500.00, 25000.00);

-- ============================================================================
-- PRODUCTOS - DEPORTES Y FITNESS (IdTipo = 5)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Bicicleta Mountain Bike', 5001, 5, 15, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91', 280000.00, 400000.00),
('Cinta de Correr Profesional', 5002, 5, 8, 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c', 490000.00, 700000.00),
('Set Mancuernas 20kg', 5003, 5, 25, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', 35000.00, 50000.00),
('Pelota Yoga Pilates', 5004, 5, 50, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 7000.00, 10000.00),
('Colchoneta Yoga Premium', 5005, 5, 40, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 14000.00, 20000.00);

-- ============================================================================
-- PRODUCTOS - HOGAR Y DECORACIÓN (IdTipo = 6)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Sillón Reclinable', 6001, 6, 12, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', 210000.00, 300000.00),
('Lámpara de Pie Moderna', 6002, 6, 30, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', 35000.00, 50000.00),
('Espejo Decorativo Grande', 6003, 6, 20, 'https://images.unsplash.com/photo-1618220179428-22790b461013', 42000.00, 60000.00),
('Alfombra Persa 2x3m', 6004, 6, 15, 'https://images.unsplash.com/photo-1600166898405-da9535204843', 70000.00, 100000.00),
('Cuadro Abstracto Canvas', 6005, 6, 25, 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca', 21000.00, 30000.00);

-- ============================================================================
-- PRODUCTOS - JUGUETES Y JUEGOS (IdTipo = 7)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('LEGO Star Wars Millennium', 7001, 7, 20, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', 105000.00, 150000.00),
('Barbie Dreamhouse', 7002, 7, 18, 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55', 70000.00, 100000.00),
('Hot Wheels Pista Extrema', 7003, 7, 30, 'https://images.unsplash.com/photo-1558060370-d644479cb6f7', 28000.00, 40000.00),
('Monopoly Edición Especial', 7004, 7, 40, 'https://images.unsplash.com/photo-1611891487603-3c5c9e8f1c5d', 21000.00, 30000.00),
('Puzzle 1000 Piezas', 7005, 7, 50, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', 10500.00, 15000.00);

-- ============================================================================
-- PRODUCTOS - LIBROS Y PAPELERÍA (IdTipo = 8)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Kindle Paperwhite', 8001, 8, 25, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 105000.00, 150000.00),
('Set Moleskine Notebooks', 8002, 8, 40, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57', 21000.00, 30000.00),
('Lapiceras Parker Premium', 8003, 8, 50, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338', 14000.00, 20000.00),
('Libro Harry Potter Colección', 8004, 8, 30, 'https://images.unsplash.com/photo-1512820790803-83ca734da794', 35000.00, 50000.00),
('Agenda 2026 Ejecutiva', 8005, 8, 60, 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', 10500.00, 15000.00);

-- ============================================================================
-- PRODUCTOS - ALIMENTOS Y BEBIDAS (IdTipo = 9)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Cafetera Nespresso', 9001, 9, 20, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', 140000.00, 200000.00),
('Set Cuchillos Profesional', 9002, 9, 25, 'https://images.unsplash.com/photo-1593618998160-e34014e67546', 42000.00, 60000.00),
('Licuadora Vitamix', 9003, 9, 18, 'https://images.unsplash.com/photo-1585515320310-259814833e62', 210000.00, 300000.00),
('Juego Ollas Tefal', 9004, 9, 22, 'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f8', 70000.00, 100000.00),
('Procesadora Philips', 9005, 9, 20, 'https://images.unsplash.com/photo-1585515320310-259814833e62', 56000.00, 80000.00);

-- ============================================================================
-- PRODUCTOS - SALUD Y CUIDADO PERSONAL (IdTipo = 10)
-- ============================================================================
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Tensiómetro Digital Omron', 10001, 10, 30, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 35000.00, 50000.00),
('Termómetro Infrarrojo', 10002, 10, 40, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 14000.00, 20000.00),
('Balanza Digital Inteligente', 10003, 10, 35, 'https://images.unsplash.com/photo-1591844163318-1e17e8f170ec', 21000.00, 30000.00),
('Oxímetro de Pulso', 10004, 10, 50, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 10500.00, 15000.00),
('Nebulizador Portátil', 10005, 10, 25, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 28000.00, 40000.00);

-- ============================================================================
-- Verificación de productos insertados
-- ============================================================================
SELECT 'Productos insertados por categoría:' AS Info;
SELECT 
    c.Nombre AS Categoria,
    COUNT(p.IdProducto) AS CantidadProductos,
    SUM(p.Stock) AS StockTotal
FROM 
    Clases c
    LEFT JOIN Productos p ON c.IdTipo = p.IdTipo
GROUP BY 
    c.IdTipo, c.Nombre
ORDER BY 
    c.IdTipo;

SELECT 'Total de productos:' AS Info;
SELECT COUNT(*) AS TotalProductos FROM Productos;
```

---

## 7. Script de Validación y Pruebas (04_test_queries.sql)

```sql
-- ============================================================================
-- Script de Validación y Pruebas
-- ============================================================================

USE ecommerce;

-- ============================================================================
-- PRUEBA 1: Verificar estructura de tablas
-- ============================================================================
SELECT '=== PRUEBA 1: Estructura de Tablas ===' AS Test;
SHOW TABLES;

-- ============================================================================
-- PRUEBA 2: Verificar datos iniciales
-- ============================================================================
SELECT '=== PRUEBA 2: Datos Iniciales ===' AS Test;

SELECT 'Países:' AS Tabla, COUNT(*) AS Registros FROM Pais
UNION ALL
SELECT 'Ciudades:', COUNT(*) FROM Ciudades
UNION ALL
SELECT 'Clases:', COUNT(*) FROM Clases
UNION ALL
SELECT 'Productos:', COUNT(*) FROM Productos;

-- ============================================================================
-- PRUEBA 3: Verificar relaciones (Foreign Keys)
-- ============================================================================
SELECT '=== PRUEBA 3: Foreign Keys ===' AS Test;

SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM 
    information_schema.KEY_COLUMN_USAGE
WHERE 
    TABLE_SCHEMA = 'ecommerce'
    AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY 
    TABLE_NAME;

-- ============================================================================
-- PRUEBA 4: Insertar cliente de prueba
-- ============================================================================
SELECT '=== PRUEBA 4: Insertar Cliente de Prueba ===' AS Test;

INSERT INTO Clientes (Nombre, Direccion, IdCiudad, IdPais, Telefono, Email)
VALUES ('Juan Pérez', 'Av. Corrientes 1234', 1, 1, '+54 11 1234-5678', 'juan.perez@email.com');

SELECT * FROM Clientes WHERE Email = 'juan.perez@email.com';

-- ============================================================================
-- PRUEBA 5: Crear orden de prueba
-- ============================================================================
SELECT '=== PRUEBA 5: Crear Orden de Prueba ===' AS Test;

-- Insertar orden
INSERT INTO Ordenes (IdCliente) 
VALUES ((SELECT IdCliente FROM Clientes WHERE Email = 'juan.perez@email.com'));

-- Insertar items
INSERT INTO Items (IdOrden, IdProducto, PrecioVenta, Cantidad)
VALUES 
    (LAST_INSERT_ID(), 1001, 700000.00, 1),
    (LAST_INSERT_ID(), 2001, 150000.00, 2);

-- Verificar orden
SELECT 
    o.IdOrden,
    c.Nombre AS Cliente,
    o.Fecha,
    p.Nombre AS Producto,
    i.Cantidad,
    i.PrecioVenta,
    (i.Cantidad * i.PrecioVenta) AS Subtotal
FROM 
    Ordenes o
    JOIN Clientes c ON o.IdCliente = c.IdCliente
    JOIN Items i ON o.IdOrden = i.IdOrden
    JOIN Productos p ON i.IdProducto = p.IdProducto
WHERE 
    c.Email = 'juan.perez@email.com';

-- ============================================================================
-- PRUEBA 6: Validar restricción ON DELETE RESTRICT
-- ============================================================================
SELECT '=== PRUEBA 6: Validar Restricción DELETE ===' AS Test;

-- Intentar eliminar un país que tiene ciudades (debe fallar)
-- DELETE FROM Pais WHERE IdPais = 1;
SELECT 'Intento de eliminar país con ciudades: DEBE FALLAR' AS Resultado;

-- ============================================================================
-- PRUEBA 7: Consultas útiles para el middleware
-- ============================================================================
SELECT '=== PRUEBA 7: Consultas para Middleware ===' AS Test;

-- Listar productos con su categoría
SELECT 
    p.IdProducto,
    p.Nombre,
    p.SKU,
    c.Nombre AS Categoria,
    p.Stock,
    p.Valor_venta,
    p.Foto
FROM 
    Productos p
    JOIN Clases c ON p.IdTipo = c.IdTipo
ORDER BY 
    c.Nombre, p.Nombre
LIMIT 10;

-- Listar ciudades por país
SELECT 
    p.Nombre AS Pais,
    c.Ciudad
FROM 
    Pais p
    JOIN Ciudades c ON p.IdPais = c.IdPais
ORDER BY 
    p.Nombre, c.Ciudad
LIMIT 10;

-- ============================================================================
-- PRUEBA 8: Estadísticas generales
-- ============================================================================
SELECT '=== PRUEBA 8: Estadísticas ===' AS Test;

SELECT 
    'Total Productos' AS Metrica,
    COUNT(*) AS Valor
FROM Productos
UNION ALL
SELECT 
    'Valor Total Inventario (Costo)',
    SUM(Valor_costo * Stock)
FROM Productos
UNION ALL
SELECT 
    'Valor Total Inventario (Venta)',
    SUM(Valor_venta * Stock)
FROM Productos
UNION ALL
SELECT 
    'Stock Total',
    SUM(Stock)
FROM Productos;

-- ============================================================================
-- FIN DE PRUEBAS
-- ============================================================================
SELECT '=== TODAS LAS PRUEBAS COMPLETADAS ===' AS Resultado;
```

---

## 8. Script de Conexión Remota (test_connection.sh)

```bash
#!/bin/bash

################################################################################
# Script de Prueba de Conexión Remota a MySQL
# Ejecutar desde el servidor del middleware
################################################################################

echo "=========================================="
echo "Prueba de Conexión a MySQL"
echo "=========================================="

# Configuración
DB_HOST="10.242.64.5"
DB_PORT="3306"
DB_NAME="ecommerce"
DB_USER="ecommerce_user"

# Solicitar contraseña
read -sp "Ingrese la contraseña para ${DB_USER}: " DB_PASSWORD
echo ""

# Probar conexión
echo "Probando conexión a ${DB_HOST}:${DB_PORT}..."

mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p"${DB_PASSWORD}" -e "
USE ${DB_NAME};
SELECT 'Conexión exitosa!' AS Resultado;
SELECT VERSION() AS Version_MySQL;
SELECT DATABASE() AS Base_Datos_Actual;
SHOW TABLES;
" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ Conexión exitosa"
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo "✗ Error en la conexión"
    echo "=========================================="
    echo ""
    echo "Verificar:"
    echo "1. MySQL está corriendo: systemctl status mysqld"
    echo "2. Firewall permite conexiones: firewall-cmd --list-all"
    echo "3. Usuario tiene permisos correctos"
    echo "4. Contraseña es correcta"
fi
```

---

## 9. README de Instalación (README.md)

Ver archivo [`PLAN.md`](PLAN.md:1) para documentación completa del proyecto.

### Pasos de Instalación Rápida

#### En el servidor 10.242.64.5 (Backend):

```bash
# 1. Copiar scripts al servidor
scp -r database/ usuario@10.242.64.5:~/

# 2. Conectar al servidor
ssh usuario@10.242.64.5

# 3. Dar permisos de ejecución
cd ~/database
chmod +x *.sh

# 4. Instalar MySQL
sudo ./install_mysql.sh

# 5. Ejecutar instalación segura
sudo mysql_secure_installation

# 6. Configurar acceso remoto
sudo ./configure_mysql.sh

# 7. Crear base de datos y tablas
mysql -u root -p < 01_create_database.sql

# 8. Cargar datos iniciales
mysql -u root -p < 02_seed_data_part1.sql
mysql -u root -p < 02_seed_data_part2.sql
mysql -u root -p < 02_seed_data_part3.sql

# 9. Ejecutar pruebas
mysql -u root -p < 04_test_queries.sql
```

#### Desde el servidor del middleware:

```bash
# Probar conexión remota
./test_connection.sh
```

---

## 10. Comandos Útiles de Administración

```bash
# Ver estado de MySQL
sudo systemctl status mysqld

# Reiniciar MySQL
sudo systemctl restart mysqld

# Ver logs de MySQL
sudo tail -f /var/log/mysqld.log

# Conectar a MySQL localmente
mysql -u root -p

# Backup de la base de datos
mysqldump -u root -p ecommerce > backup_ecommerce_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u root -p ecommerce < backup_ecommerce_20260603.sql

# Ver usuarios de MySQL
mysql -u root -p -e "SELECT User, Host FROM mysql.user;"

# Ver permisos de un usuario
mysql -u root -p -e "SHOW GRANTS FOR 'ecommerce_user'@'%';"
```

---

## Notas Importantes

1. **Seguridad**: Cambiar todas las contraseñas por defecto
2. **Backup**: Configurar backups automáticos diarios
3. **Monitoreo**: Implementar monitoreo de performance
4. **Logs**: Revisar logs regularmente
5. **Actualizaciones**: Mantener MySQL actualizado

---

## Próximos Pasos

Una vez completada la instalación del backend:

1. **Parte 2**: Implementar middleware con Quarkus
   - Crear APIs RESTful
   - Configurar conexión JDBC a MySQL
   - Implementar lógica de negocio
   - Configurar CORS para frontend

2. **Parte 3**: Implementar frontend con React
   - Crear componentes de UI
   - Integrar con APIs del middleware
   - Implementar carrito de compras
   - Gestión de órdenes