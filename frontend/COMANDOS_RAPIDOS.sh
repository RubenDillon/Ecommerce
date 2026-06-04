#!/bin/bash

################################################################################
# Script de Comandos Rápidos para Despliegue del Frontend
# Uso: bash COMANDOS_RAPIDOS.sh [opcion]
################################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# Función para mostrar el menú
show_menu() {
    print_header "Comandos Rápidos - Frontend E-Commerce"
    echo "Selecciona una opción:"
    echo ""
    echo "  1) Generar todos los archivos (ejecutar script Python)"
    echo "  2) Instalar dependencias (npm install)"
    echo "  3) Configurar .env"
    echo "  4) Iniciar servidor de desarrollo (npm run dev)"
    echo "  5) Build para producción (npm run build)"
    echo "  6) Limpiar y reinstalar (rm node_modules + npm install)"
    echo "  7) Ver estructura de archivos generados"
    echo "  8) Verificar estado del proyecto"
    echo "  9) Setup completo (generar + instalar + configurar)"
    echo "  0) Salir"
    echo ""
    read -p "Opción: " option
    echo ""
    
    case $option in
        1) generar_archivos ;;
        2) instalar_dependencias ;;
        3) configurar_env ;;
        4) iniciar_dev ;;
        5) build_produccion ;;
        6) limpiar_reinstalar ;;
        7) ver_estructura ;;
        8) verificar_estado ;;
        9) setup_completo ;;
        0) exit 0 ;;
        *) print_error "Opción inválida"; show_menu ;;
    esac
}

# Función 1: Generar archivos
generar_archivos() {
    print_header "Generando Archivos del Frontend"
    
    if [ ! -f "generar_todos_archivos.py" ]; then
        print_error "No se encuentra generar_todos_archivos.py"
        exit 1
    fi
    
    print_info "Ejecutando script generador..."
    python3 generar_todos_archivos.py
    
    print_success "Archivos generados exitosamente"
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 2: Instalar dependencias
instalar_dependencias() {
    print_header "Instalando Dependencias"
    
    if [ ! -f "package.json" ]; then
        print_error "No se encuentra package.json"
        exit 1
    fi
    
    print_info "Instalando dependencias con npm..."
    npm install
    
    print_success "Dependencias instaladas exitosamente"
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 3: Configurar .env
configurar_env() {
    print_header "Configurando Variables de Entorno"
    
    if [ -f ".env" ]; then
        print_warning "El archivo .env ya existe"
        read -p "¿Deseas sobrescribirlo? (s/n): " respuesta
        if [ "$respuesta" != "s" ]; then
            print_info "Operación cancelada"
            echo ""
            read -p "Presiona Enter para continuar..."
            show_menu
            return
        fi
    fi
    
    if [ ! -f ".env.example" ]; then
        print_error "No se encuentra .env.example"
        exit 1
    fi
    
    cp .env.example .env
    print_success "Archivo .env creado"
    
    print_info "Contenido actual:"
    cat .env
    
    echo ""
    read -p "¿Deseas editar el archivo .env? (s/n): " editar
    if [ "$editar" = "s" ]; then
        ${EDITOR:-nano} .env
        print_success ".env editado"
    fi
    
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 4: Iniciar servidor de desarrollo
iniciar_dev() {
    print_header "Iniciando Servidor de Desarrollo"
    
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules no existe. Ejecutando npm install primero..."
        npm install
    fi
    
    if [ ! -f ".env" ]; then
        print_warning ".env no existe. Creándolo desde .env.example..."
        cp .env.example .env
    fi
    
    print_info "Iniciando servidor en http://0.0.0.0:3000"
    print_info "Presiona Ctrl+C para detener el servidor"
    echo ""
    
    npm run dev
}

# Función 5: Build para producción
build_produccion() {
    print_header "Compilando para Producción"
    
    if [ ! -d "node_modules" ]; then
        print_error "node_modules no existe. Ejecuta 'npm install' primero"
        exit 1
    fi
    
    print_info "Compilando proyecto..."
    npm run build
    
    print_success "Build completado"
    print_info "Archivos en: dist/"
    
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 6: Limpiar y reinstalar
limpiar_reinstalar() {
    print_header "Limpiando y Reinstalando"
    
    print_warning "Esto eliminará node_modules y package-lock.json"
    read -p "¿Estás seguro? (s/n): " confirmar
    
    if [ "$confirmar" != "s" ]; then
        print_info "Operación cancelada"
        echo ""
        read -p "Presiona Enter para continuar..."
        show_menu
        return
    fi
    
    print_info "Eliminando node_modules..."
    rm -rf node_modules
    
    print_info "Eliminando package-lock.json..."
    rm -f package-lock.json
    
    print_info "Reinstalando dependencias..."
    npm install
    
    print_success "Limpieza y reinstalación completada"
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 7: Ver estructura
ver_estructura() {
    print_header "Estructura de Archivos Generados"
    
    if command -v tree &> /dev/null; then
        tree src -L 2
    else
        print_info "Archivos en src/:"
        find src -type f | sort
    fi
    
    echo ""
    print_info "Total de archivos TypeScript/TSX:"
    find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l
    
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 8: Verificar estado
verificar_estado() {
    print_header "Verificando Estado del Proyecto"
    
    # Verificar archivos importantes
    print_info "Verificando archivos clave..."
    
    archivos_clave=(
        "package.json"
        "tsconfig.json"
        "vite.config.ts"
        "generar_todos_archivos.py"
        "src/App.tsx"
        "src/main.tsx"
    )
    
    for archivo in "${archivos_clave[@]}"; do
        if [ -f "$archivo" ]; then
            echo -e "${GREEN}✓${NC} $archivo"
        else
            echo -e "${RED}✗${NC} $archivo (falta)"
        fi
    done
    
    echo ""
    
    # Verificar node_modules
    if [ -d "node_modules" ]; then
        print_success "node_modules existe"
    else
        print_warning "node_modules no existe (ejecuta npm install)"
    fi
    
    # Verificar .env
    if [ -f ".env" ]; then
        print_success ".env existe"
    else
        print_warning ".env no existe (copia .env.example)"
    fi
    
    # Verificar archivos generados
    echo ""
    print_info "Archivos generados en src/:"
    if [ -d "src/types" ] && [ -d "src/services" ]; then
        print_success "Estructura src/ generada"
        echo "  - Types: $(find src/types -type f | wc -l) archivos"
        echo "  - Services: $(find src/services -type f | wc -l) archivos"
        echo "  - Components: $(find src/components -type f 2>/dev/null | wc -l) archivos"
        echo "  - Pages: $(find src/pages -type f 2>/dev/null | wc -l) archivos"
    else
        print_warning "Estructura src/ no generada (ejecuta el script generador)"
    fi
    
    echo ""
    read -p "Presiona Enter para continuar..."
    show_menu
}

# Función 9: Setup completo
setup_completo() {
    print_header "Setup Completo del Proyecto"
    
    print_warning "Esto ejecutará:"
    echo "  1. Generar todos los archivos"
    echo "  2. Instalar dependencias"
    echo "  3. Configurar .env"
    echo ""
    read -p "¿Continuar? (s/n): " confirmar
    
    if [ "$confirmar" != "s" ]; then
        print_info "Operación cancelada"
        echo ""
        read -p "Presiona Enter para continuar..."
        show_menu
        return
    fi
    
    # Paso 1: Generar archivos
    print_header "Paso 1/3: Generando Archivos"
    python3 generar_todos_archivos.py
    print_success "Archivos generados"
    
    # Paso 2: Instalar dependencias
    print_header "Paso 2/3: Instalando Dependencias"
    npm install
    print_success "Dependencias instaladas"
    
    # Paso 3: Configurar .env
    print_header "Paso 3/3: Configurando .env"
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success ".env creado"
    else
        print_info ".env ya existe"
    fi
    
    print_header "Setup Completado"
    print_success "El proyecto está listo para usar"
    print_info "Ejecuta 'npm run dev' para iniciar el servidor"
    
    echo ""
    read -p "¿Deseas iniciar el servidor ahora? (s/n): " iniciar
    if [ "$iniciar" = "s" ]; then
        iniciar_dev
    else
        echo ""
        read -p "Presiona Enter para continuar..."
        show_menu
    fi
}

# Inicio del script
if [ "$1" = "" ]; then
    show_menu
else
    case $1 in
        generar) generar_archivos ;;
        instalar) instalar_dependencias ;;
        config) configurar_env ;;
        dev) iniciar_dev ;;
        build) build_produccion ;;
        limpiar) limpiar_reinstalar ;;
        estructura) ver_estructura ;;
        verificar) verificar_estado ;;
        setup) setup_completo ;;
        *) 
            print_error "Opción inválida: $1"
            echo ""
            echo "Opciones disponibles:"
            echo "  generar    - Generar archivos"
            echo "  instalar   - Instalar dependencias"
            echo "  config     - Configurar .env"
            echo "  dev        - Iniciar servidor"
            echo "  build      - Build producción"
            echo "  limpiar    - Limpiar y reinstalar"
            echo "  estructura - Ver estructura"
            echo "  verificar  - Verificar estado"
            echo "  setup      - Setup completo"
            ;;
    esac
fi

# Made with Bob
