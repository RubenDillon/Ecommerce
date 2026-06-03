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

-- Made with Bob
