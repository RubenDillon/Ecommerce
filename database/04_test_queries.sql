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

SET @orden_id = LAST_INSERT_ID();

-- Insertar items
INSERT INTO Items (IdOrden, IdProducto, PrecioVenta, Cantidad)
VALUES 
    (@orden_id, 1001, 700000.00, 1),
    (@orden_id, 2001, 150000.00, 2);

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
-- Descomentado para prueba manual:
-- DELETE FROM Pais WHERE IdPais = 1;
SELECT 'Intento de eliminar país con ciudades: DEBE FALLAR (comentado para no interrumpir)' AS Resultado;

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
-- PRUEBA 9: Verificar índices
-- ============================================================================
SELECT '=== PRUEBA 9: Índices Creados ===' AS Test;

SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE
FROM 
    information_schema.STATISTICS
WHERE 
    TABLE_SCHEMA = 'ecommerce'
ORDER BY 
    TABLE_NAME, INDEX_NAME;

-- ============================================================================
-- PRUEBA 10: Productos más caros y más baratos
-- ============================================================================
SELECT '=== PRUEBA 10: Análisis de Precios ===' AS Test;

SELECT 'Productos más caros:' AS Categoria;
SELECT 
    p.Nombre,
    c.Nombre AS Categoria,
    p.Valor_venta,
    p.Stock
FROM 
    Productos p
    JOIN Clases c ON p.IdTipo = c.IdTipo
ORDER BY 
    p.Valor_venta DESC
LIMIT 5;

SELECT 'Productos más baratos:' AS Categoria;
SELECT 
    p.Nombre,
    c.Nombre AS Categoria,
    p.Valor_venta,
    p.Stock
FROM 
    Productos p
    JOIN Clases c ON p.IdTipo = c.IdTipo
ORDER BY 
    p.Valor_venta ASC
LIMIT 5;

-- ============================================================================
-- FIN DE PRUEBAS
-- ============================================================================
SELECT '=== TODAS LAS PRUEBAS COMPLETADAS ===' AS Resultado;
SELECT 'Base de datos lista para conectar con el middleware' AS Estado;

-- Made with Bob
