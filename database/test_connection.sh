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
    echo ""
    echo "Información de la base de datos:"
    mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p"${DB_PASSWORD}" -e "
    USE ${DB_NAME};
    SELECT 'Países:' AS Tabla, COUNT(*) AS Registros FROM Pais
    UNION ALL
    SELECT 'Ciudades:', COUNT(*) FROM Ciudades
    UNION ALL
    SELECT 'Clases:', COUNT(*) FROM Clases
    UNION ALL
    SELECT 'Productos:', COUNT(*) FROM Productos
    UNION ALL
    SELECT 'Clientes:', COUNT(*) FROM Clientes
    UNION ALL
    SELECT 'Ordenes:', COUNT(*) FROM Ordenes;
    "
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
    echo "5. Red permite conexión al puerto 3306"
fi

# Made with Bob
