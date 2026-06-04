#!/bin/bash

# Script para generar todos los archivos Java del proyecto
# Este script crea la estructura completa del middleware

BASE_DIR="src/main/java/com/ecommerce"

echo "Generando archivos del proyecto E-commerce API..."
echo "=================================================="

# Crear directorios si no existen
mkdir -p $BASE_DIR/{dto,entity,repository,mapper,service,resource,exception,config}

echo "✓ Directorios creados"
echo ""
echo "Ahora debes copiar los archivos desde los documentos:"
echo ""
echo "1. DTOs (9 archivos) - desde CODIGO_COMPLETO.md líneas 198-421"
echo "   - PaisDTO.java"
echo "   - CiudadDTO.java"
echo "   - ClienteDTO.java"
echo "   - ClaseDTO.java"
echo "   - ProductoDTO.java"
echo "   - OrdenDTO.java"
echo "   - ItemDTO.java"
echo "   - CrearOrdenDTO.java"
echo "   - ErrorResponse.java"
echo ""
echo "2. Entities (8 archivos) - Ya existen en el servidor"
echo ""
echo "3. Repositories (7 archivos) - desde CODIGO_COMPLETO.md líneas 7-194"
echo ""
echo "4. Mappers (7 archivos) - desde CODIGO_COMPLETO.md líneas 425-612"
echo ""
echo "5. Exceptions (3 archivos) - desde CODIGO_COMPLETO.md líneas 616-696"
echo ""
echo "6. Services (6 archivos) - desde CODIGO_COMPLETO_PARTE2.md"
echo ""
echo "7. Resources (6 archivos) - VERSIÓN CORREGIDA a continuación"
echo ""
echo "=================================================="
echo "Los Resources tienen errores. Usa las versiones corregidas."

# Made with Bob
