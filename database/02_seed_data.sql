-- ============================================================================
-- Script Consolidado de Datos Iniciales
-- Este script ejecuta todos los inserts de datos iniciales
-- ============================================================================

USE ecommerce;

-- ============================================================================
-- PARTE 1: PAÍSES Y CIUDADES
-- ============================================================================

-- Insertar Países
INSERT INTO Pais (Nombre) VALUES
('Argentina'),
('Chile'),
('Uruguay'),
('Paraguay'),
('Brasil');

-- Insertar Ciudades - Argentina
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

-- Insertar Ciudades - Chile
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

-- Insertar Ciudades - Uruguay
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

-- Insertar Ciudades - Paraguay
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

-- Insertar Ciudades - Brasil
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
-- PARTE 2: CLASES DE PRODUCTOS
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
-- PARTE 3: PRODUCTOS
-- ============================================================================

-- Electrónica
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('PlayStation 5', 1001, 1, 25, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', 490000.00, 700000.00),
('Nintendo Switch OLED', 1002, 1, 30, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e', 350000.00, 500000.00),
('iPhone 15 Pro', 1003, 1, 15, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569', 910000.00, 1300000.00),
('Samsung Galaxy S24', 1004, 1, 20, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c', 630000.00, 900000.00),
('iPad Air M2', 1005, 1, 18, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', 560000.00, 800000.00);

-- Indumentaria
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Zapatillas Nike Air Max', 2001, 2, 50, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 105000.00, 150000.00),
('Zapatillas Reebok Classic', 2002, 2, 45, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', 70000.00, 100000.00),
('Remera Adidas Original', 2003, 2, 100, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 21000.00, 30000.00),
('Jean Levis 501', 2004, 2, 60, 'https://images.unsplash.com/photo-1542272604-787c3835535d', 56000.00, 80000.00),
('Campera North Face', 2005, 2, 35, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 140000.00, 200000.00);

-- Electrodomésticos
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Heladera Samsung 400L', 3001, 3, 12, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5', 420000.00, 600000.00),
('Lavarropas LG 8kg', 3002, 3, 15, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1', 350000.00, 500000.00),
('Microondas Whirlpool', 3003, 3, 25, 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d', 70000.00, 100000.00),
('Aire Acondicionado Split 3500W', 3004, 3, 10, 'https://images.unsplash.com/photo-1631545806609-c2f4e4e6e0e8', 280000.00, 400000.00),
('Aspiradora Robot Roomba', 3005, 3, 20, 'https://images.unsplash.com/photo-1558317374-067fb5f30001', 210000.00, 300000.00);

-- Productos de Belleza
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Set Makeup MAC', 4001, 4, 40, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796', 35000.00, 50000.00),
('Perfume Chanel N°5', 4002, 4, 30, 'https://images.unsplash.com/photo-1541643600914-78b084683601', 140000.00, 200000.00),
('Crema Facial La Roche-Posay', 4003, 4, 50, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883', 28000.00, 40000.00),
('Shampoo Kerastase', 4004, 4, 60, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d', 21000.00, 30000.00),
('Serum Vitamina C', 4005, 4, 45, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 17500.00, 25000.00);

-- Deportes y Fitness
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Bicicleta Mountain Bike', 5001, 5, 15, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91', 280000.00, 400000.00),
('Cinta de Correr Profesional', 5002, 5, 8, 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c', 490000.00, 700000.00),
('Set Mancuernas 20kg', 5003, 5, 25, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', 35000.00, 50000.00),
('Pelota Yoga Pilates', 5004, 5, 50, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 7000.00, 10000.00),
('Colchoneta Yoga Premium', 5005, 5, 40, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 14000.00, 20000.00);

-- Hogar y Decoración
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Sillón Reclinable', 6001, 6, 12, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', 210000.00, 300000.00),
('Lámpara de Pie Moderna', 6002, 6, 30, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', 35000.00, 50000.00),
('Espejo Decorativo Grande', 6003, 6, 20, 'https://images.unsplash.com/photo-1618220179428-22790b461013', 42000.00, 60000.00),
('Alfombra Persa 2x3m', 6004, 6, 15, 'https://images.unsplash.com/photo-1600166898405-da9535204843', 70000.00, 100000.00),
('Cuadro Abstracto Canvas', 6005, 6, 25, 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca', 21000.00, 30000.00);

-- Juguetes y Juegos
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('LEGO Star Wars Millennium', 7001, 7, 20, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', 105000.00, 150000.00),
('Barbie Dreamhouse', 7002, 7, 18, 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55', 70000.00, 100000.00),
('Hot Wheels Pista Extrema', 7003, 7, 30, 'https://images.unsplash.com/photo-1558060370-d644479cb6f7', 28000.00, 40000.00),
('Monopoly Edición Especial', 7004, 7, 40, 'https://images.unsplash.com/photo-1611891487603-3c5c9e8f1c5d', 21000.00, 30000.00),
('Puzzle 1000 Piezas', 7005, 7, 50, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', 10500.00, 15000.00);

-- Libros y Papelería
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Kindle Paperwhite', 8001, 8, 25, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 105000.00, 150000.00),
('Set Moleskine Notebooks', 8002, 8, 40, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57', 21000.00, 30000.00),
('Lapiceras Parker Premium', 8003, 8, 50, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338', 14000.00, 20000.00),
('Libro Harry Potter Colección', 8004, 8, 30, 'https://images.unsplash.com/photo-1512820790803-83ca734da794', 35000.00, 50000.00),
('Agenda 2026 Ejecutiva', 8005, 8, 60, 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', 10500.00, 15000.00);

-- Alimentos y Bebidas
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Cafetera Nespresso', 9001, 9, 20, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', 140000.00, 200000.00),
('Set Cuchillos Profesional', 9002, 9, 25, 'https://images.unsplash.com/photo-1593618998160-e34014e67546', 42000.00, 60000.00),
('Licuadora Vitamix', 9003, 9, 18, 'https://images.unsplash.com/photo-1585515320310-259814833e62', 210000.00, 300000.00),
('Juego Ollas Tefal', 9004, 9, 22, 'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f8', 70000.00, 100000.00),
('Procesadora Philips', 9005, 9, 20, 'https://images.unsplash.com/photo-1585515320310-259814833e62', 56000.00, 80000.00);

-- Salud y Cuidado Personal
INSERT INTO Productos (Nombre, SKU, IdTipo, Stock, Foto, Valor_costo, Valor_venta) VALUES
('Tensiómetro Digital Omron', 10001, 10, 30, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 35000.00, 50000.00),
('Termómetro Infrarrojo', 10002, 10, 40, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 14000.00, 20000.00),
('Balanza Digital Inteligente', 10003, 10, 35, 'https://images.unsplash.com/photo-1591844163318-1e17e8f170ec', 21000.00, 30000.00),
('Oxímetro de Pulso', 10004, 10, 50, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 10500.00, 15000.00),
('Nebulizador Portátil', 10005, 10, 25, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 28000.00, 40000.00);

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

SELECT '=== RESUMEN DE DATOS CARGADOS ===' AS Info;

SELECT 'Países:' AS Tabla, COUNT(*) AS Registros FROM Pais
UNION ALL
SELECT 'Ciudades:', COUNT(*) FROM Ciudades
UNION ALL
SELECT 'Clases:', COUNT(*) FROM Clases
UNION ALL
SELECT 'Productos:', COUNT(*) FROM Productos;

SELECT '=== BASE DE DATOS LISTA ===' AS Estado;

-- Made with Bob
