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
echo "2. Ejecutar: sudo ./configure_mysql.sh"
echo "3. Ejecutar scripts SQL de creación de base de datos"

# Made with Bob
