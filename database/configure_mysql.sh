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

# Made with Bob
