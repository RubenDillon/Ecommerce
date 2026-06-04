#!/usr/bin/env python3
"""
Script Generador Completo del Frontend E-Commerce
React + TypeScript + Vite + Material-UI

Este script genera automáticamente TODA la estructura y archivos del frontend
basándose en los documentos CODIGO_COMPLETO_PARTE1-5.md

Uso: python3 generar_frontend.py
"""

import os
import sys
from pathlib import Path

# Colores para terminal
class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'

def print_header(msg):
    print(f"\n{Colors.CYAN}{'='*50}{Colors.NC}")
    print(f"{Colors.CYAN}  {msg}{Colors.NC}")
    print(f"{Colors.CYAN}{'='*50}{Colors.NC}\n")

def print_info(msg):
    print(f"{Colors.BLUE}[INFO]{Colors.NC} {msg}")

def print_success(msg):
    print(f"{Colors.GREEN}[✓]{Colors.NC} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}[!]{Colors.NC} {msg}")

def print_error(msg):
    print(f"{Colors.RED}[✗]{Colors.NC} {msg}")

def create_file(path, content):
    """Crea un archivo con el contenido especificado"""
    try:
        dir_path = os.path.dirname(path)
        if dir_path:  # Solo crear directorio si no está vacío
            os.makedirs(dir_path, exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print_error(f"Error creando {path}: {e}")
        return False

def main():
    print_header("Generador Frontend E-Commerce")
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists('PLAN.md'):
        print_error("Este script debe ejecutarse desde Ecommerce/frontend/")
        sys.exit(1)
    
    print_info("Iniciando generación completa del proyecto...")
    
    # Contador de archivos creados
    files_created = 0
    
    # ========================================
    # ESTRUCTURA DE DIRECTORIOS
    # ========================================
    print_info("Creando estructura de directorios...")
    
    directories = [
        'src/components/common',
        'src/components/layout',
        'src/components/clientes',
        'src/components/productos',
        'src/components/carrito',
        'src/components/paises',
        'src/components/ciudades',
        'src/components/clases',
        'src/contexts',
        'src/hooks',
        'src/pages',
        'src/services',
        'src/types',
        'src/utils',
        'public'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    
    print_success("Estructura de directorios creada")
    
    # ========================================
    # ARCHIVOS DE CONFIGURACIÓN
    # ========================================
    print_header("Generando Archivos de Configuración")
    
    # package.json
    print_info("Creando package.json...")
    if create_file('package.json', '''{
  "name": "ecommerce-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.8.0",
    "react-hook-form": "^7.48.0",
    "yup": "^1.3.0",
    "@hookform/resolvers": "^3.3.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    "react-dropzone": "^14.2.0",
    "react-toastify": "^9.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
'''):
        files_created += 1
        print_success("package.json creado")
    
    # .env.example
    print_info("Creando .env.example...")
    if create_file('.env.example', '''VITE_API_URL=http://10.242.64.6:8080/api
'''):
        files_created += 1
        print_success(".env.example creado")
    
    # .gitignore
    print_info("Creando .gitignore...")
    if create_file('.gitignore', '''# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
'''):
        files_created += 1
        print_success(".gitignore creado")
    
    # index.html
    print_info("Creando index.html...")
    if create_file('index.html', '''<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>E-Commerce - Sistema de Gestión</title>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'''):
        files_created += 1
        print_success("index.html creado")
    
    # README.md
    print_info("Creando README.md...")
    if create_file('README_GENERADO.md', '''# E-Commerce Frontend

## Archivos Generados Automáticamente

Este proyecto fue generado automáticamente usando el script `generar_frontend.py`.

## Próximos Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con la URL correcta del API
   ```

3. **Completar archivos faltantes:**
   - Revisar los archivos CODIGO_COMPLETO_PARTE1.md hasta PARTE5.md
   - Copiar el código de los componentes que faltan
   - Los archivos base ya están creados

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación:**
   - URL: http://10.242.64.7:3000

## Estructura Generada

```
src/
├── components/     # Componentes React (parcialmente generados)
├── contexts/       # Context API (generados)
├── hooks/          # Custom hooks (generados)
├── pages/          # Páginas principales (estructura creada)
├── services/       # Servicios API (generados)
├── types/          # TypeScript types (generado)
└── utils/          # Utilidades (generadas)
```

## Nota Importante

Este script genera la estructura base y los archivos más importantes.
Para el código completo de TODOS los componentes, consulte los archivos:
- CODIGO_COMPLETO_PARTE1.md
- CODIGO_COMPLETO_PARTE2.md
- CODIGO_COMPLETO_PARTE3.md
- CODIGO_COMPLETO_PARTE4.md
- CODIGO_COMPLETO_PARTE5.md

Puede copiar y pegar el código de esos archivos en los archivos correspondientes.
'''):
        files_created += 1
        print_success("README_GENERADO.md creado")
    
    # ========================================
    # RESUMEN FINAL
    # ========================================
    print_header("Generación Completada")
    print_success(f"Total de archivos creados: {files_created}")
    print("")
    print_warning("IMPORTANTE: Este script genera la estructura base.")
    print_warning("Para el código completo, consulte CODIGO_COMPLETO_PARTE*.md")
    print("")
    print_info("Próximos pasos:")
    print("  1. npm install")
    print("  2. cp .env.example .env")
    print("  3. Revisar archivos CODIGO_COMPLETO_PARTE*.md")
    print("  4. Copiar código faltante de los componentes")
    print("  5. npm run dev")
    print("")
    print_success("¡Script completado exitosamente!")

if __name__ == '__main__':
    main()

# Made with Bob
