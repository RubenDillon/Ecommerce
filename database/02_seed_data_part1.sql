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

-- Made with Bob
