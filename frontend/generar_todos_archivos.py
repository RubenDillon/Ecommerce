#!/usr/bin/env python3
"""
Script Extractor y Generador Completo del Frontend E-Commerce
Extrae código de CODIGO_COMPLETO_PARTE*.md y genera TODOS los archivos

Este script parsea los archivos markdown y extrae automáticamente
todos los bloques de código para crear los archivos del proyecto.

Uso: python3 generar_todos_archivos.py
"""

import os
import re
import sys
from pathlib import Path

# Colores para terminal
class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    CYAN = '\033[0;36m'
    MAGENTA = '\033[0;35m'
    NC = '\033[0m'

def print_header(msg):
    print(f"\n{Colors.CYAN}{'='*60}{Colors.NC}")
    print(f"{Colors.CYAN}  {msg}{Colors.NC}")
    print(f"{Colors.CYAN}{'='*60}{Colors.NC}\n")

def print_info(msg):
    print(f"{Colors.BLUE}[INFO]{Colors.NC} {msg}")

def print_success(msg):
    print(f"{Colors.GREEN}[✓]{Colors.NC} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}[!]{Colors.NC} {msg}")

def print_error(msg):
    print(f"{Colors.RED}[✗]{Colors.NC} {msg}")

def extract_code_blocks(markdown_file):
    """
    Extrae bloques de código de un archivo markdown.
    Retorna una lista de tuplas (ruta_archivo, contenido, lenguaje)
    """
    if not os.path.exists(markdown_file):
        print_error(f"Archivo no encontrado: {markdown_file}")
        return []
    
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patrón para encontrar bloques de código con comentario de ruta
    # Busca: // src/path/file.ext seguido de ```typescript o ```css, etc.
    pattern = r'//\s*([^\n]+)\n```(\w+)\n(.*?)```'
    
    blocks = []
    for match in re.finditer(pattern, content, re.DOTALL):
        file_path = match.group(1).strip()
        language = match.group(2).strip()
        code = match.group(3).strip()
        
        # Limpiar la ruta del archivo
        file_path = file_path.replace('// ', '').replace('//', '')
        
        blocks.append((file_path, code, language))
    
    return blocks

def create_file_from_block(file_path, content):
    """Crea un archivo con el contenido especificado"""
    try:
        # Crear directorio si no existe
        dir_path = os.path.dirname(file_path)
        if dir_path:
            os.makedirs(dir_path, exist_ok=True)
        
        # Escribir archivo
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    except Exception as e:
        print_error(f"Error creando {file_path}: {e}")
        return False

def parse_markdown_sections(markdown_file):
    """
    Parsea un archivo markdown buscando secciones con código.
    Formato esperado: ## N. Nombre (src/path/file.ext)
    """
    if not os.path.exists(markdown_file):
        return []
    
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patrón mejorado para capturar secciones
    # Busca títulos como: ## 1. Types (src/types/index.ts)
    sections = []
    
    # Dividir por secciones de nivel 2
    parts = re.split(r'\n## \d+\.\s+', content)
    
    for part in parts[1:]:  # Saltar la primera parte (antes del primer ##)
        # Extraer nombre y ruta del archivo
        first_line = part.split('\n')[0]
        
        # Buscar ruta entre paréntesis
        path_match = re.search(r'\(([^)]+)\)', first_line)
        if not path_match:
            continue
        
        file_path = path_match.group(1).strip()
        
        # Extraer bloques de código
        code_blocks = re.findall(r'```(\w+)\n(.*?)```', part, re.DOTALL)
        
        if code_blocks:
            # Tomar el primer bloque de código (usualmente el principal)
            language, code = code_blocks[0]
            code = code.strip()
            
            sections.append((file_path, code, language))
    
    return sections

def main():
    print_header("Generador Automático Completo del Frontend")
    
    # Verificar ubicación
    if not os.path.exists('PLAN.md'):
        print_error("Este script debe ejecutarse desde Ecommerce/frontend/")
        sys.exit(1)
    
    print_info("Iniciando extracción y generación de archivos...")
    
    # Archivos markdown a procesar
    markdown_files = [
        'CODIGO_COMPLETO_PARTE1.md',
        'CODIGO_COMPLETO_PARTE2.md',
        'CODIGO_COMPLETO_PARTE3.md',
        'CODIGO_COMPLETO_PARTE4.md',
        'CODIGO_COMPLETO_PARTE5.md'
    ]
    
    # Verificar que existan los archivos
    for md_file in markdown_files:
        if not os.path.exists(md_file):
            print_error(f"Archivo no encontrado: {md_file}")
            sys.exit(1)
    
    print_success("Todos los archivos markdown encontrados")
    
    # Contador de archivos
    total_files = 0
    created_files = 0
    
    # Procesar cada archivo markdown
    for md_file in markdown_files:
        print_header(f"Procesando {md_file}")
        
        sections = parse_markdown_sections(md_file)
        
        print_info(f"Encontradas {len(sections)} secciones de código")
        
        for file_path, code, language in sections:
            total_files += 1
            
            # Mostrar progreso
            print_info(f"Creando: {file_path}")
            
            if create_file_from_block(file_path, code):
                created_files += 1
                print_success(f"✓ {file_path}")
            else:
                print_error(f"✗ {file_path}")
    
    # Resumen final
    print_header("Generación Completada")
    print_success(f"Archivos procesados: {total_files}")
    print_success(f"Archivos creados: {created_files}")
    
    if created_files < total_files:
        print_warning(f"Algunos archivos no pudieron crearse ({total_files - created_files} fallidos)")
    
    print("")
    print_info("Próximos pasos:")
    print("  1. Verificar archivos creados")
    print("  2. npm install")
    print("  3. cp .env.example .env")
    print("  4. npm run dev")
    print("")
    print_success("¡Proceso completado!")

if __name__ == '__main__':
    main()

# Made with Bob
