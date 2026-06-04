# Guía Completa de Despliegue del Frontend

Esta guía te llevará paso a paso desde tu máquina local hasta tener el frontend funcionando en el servidor 10.242.64.7.

---

## 📋 Tabla de Contenidos

1. [Preparar el Proyecto Localmente](#1-preparar-el-proyecto-localmente)
2. [Subir a Git](#2-subir-a-git)
3. [Descargar en el Servidor Frontend](#3-descargar-en-el-servidor-frontend)
4. [Ejecutar el Script Generador](#4-ejecutar-el-script-generador)
5. [Instalar Dependencias](#5-instalar-dependencias)
6. [Configurar y Ejecutar](#6-configurar-y-ejecutar)
7. [Verificación](#7-verificación)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Preparar el Proyecto Localmente

### Verificar que todo está listo

```bash
cd ~/Desktop/Ecommerce/frontend

# Verificar que existen los archivos importantes
ls -la generar_todos_archivos.py
ls -la CODIGO_COMPLETO_PARTE*.md
ls -la package.json
```

### Limpiar archivos generados (opcional)

Si ya ejecutaste el script localmente y quieres empezar limpio en el servidor:

```bash
# Eliminar node_modules si existe
rm -rf node_modules

# Eliminar archivos generados en src/ si quieres regenerarlos en el servidor
# (OPCIONAL - solo si quieres probar la generación desde cero en el servidor)
# rm -rf src/components src/contexts src/hooks src/pages src/services src/types src/utils
# rm -f src/App.tsx src/main.tsx src/index.css src/vite-env.d.ts
```

---

## 2. Subir a Git

### Opción A: Si ya tienes un repositorio Git

```bash
cd ~/Desktop/Ecommerce

# Verificar estado
git status

# Agregar todos los archivos del frontend
git add frontend/

# Commit
git commit -m "feat: Add complete frontend with auto-generator script"

# Push al repositorio
git push origin main
# O si tu rama es master:
# git push origin master
```

### Opción B: Si NO tienes repositorio Git aún

```bash
cd ~/Desktop/Ecommerce

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Complete E-commerce project"

# Conectar con repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
# O si usas SSH:
# git remote add origin git@github.com:TU_USUARIO/TU_REPO.git

# Push
git push -u origin main
```

### Verificar que se subió correctamente

Ve a tu repositorio en GitHub/GitLab/Bitbucket y verifica que la carpeta `frontend/` esté ahí con todos los archivos.

---

## 3. Descargar en el Servidor Frontend

### Conectarse al servidor

```bash
ssh usuario@10.242.64.7
# Ingresa tu contraseña cuando te la pida
```

### Clonar el repositorio

```bash
# Ir al directorio donde quieres el proyecto
cd ~
# O si prefieres otro directorio:
# cd /opt/apps

# Clonar el repositorio
git clone https://github.com/TU_USUARIO/TU_REPO.git ecommerce
# O si usas SSH:
# git clone git@github.com:TU_USUARIO/TU_REPO.git ecommerce

# Entrar al directorio del frontend
cd ecommerce/frontend
```

### Verificar que todo se descargó

```bash
# Listar archivos
ls -la

# Deberías ver:
# - generar_todos_archivos.py
# - CODIGO_COMPLETO_PARTE1.md hasta PARTE5.md
# - package.json
# - tsconfig.json
# - vite.config.ts
# - etc.
```

---

## 4. Ejecutar el Script Generador

### Verificar Python

```bash
# Verificar versión de Python
python3 --version
# Debe ser Python 3.6 o superior
```

### Ejecutar el script

```bash
# Dar permisos de ejecución
chmod +x generar_todos_archivos.py

# Ejecutar el script
python3 generar_todos_archivos.py
```

**Salida esperada:**
```
============================================================
  Generador Automático Completo del Frontend
============================================================

[INFO] Iniciando extracción y generación de archivos...
[✓] Todos los archivos markdown encontrados

============================================================
  Procesando CODIGO_COMPLETO_PARTE1.md
============================================================

[INFO] Encontradas 15 secciones de código
[INFO] Creando: src/types/index.ts
[✓] ✓ src/types/index.ts
...
[✓] Archivos procesados: 42
[✓] Archivos creados: 42
```

### Verificar archivos generados

```bash
# Ver estructura creada
tree src -L 2
# O si no tienes tree:
find src -type f | head -20

# Deberías ver todos los archivos .ts y .tsx creados
```

---

## 5. Instalar Dependencias

### Verificar Node.js y npm

```bash
# Verificar Node.js
node --version
# Debe ser v18 o superior

# Verificar npm
npm --version
# Debe ser v9 o superior
```

### Si NO tienes Node.js instalado

```bash
# En Red Hat Enterprise Linux 9
sudo dnf module enable nodejs:18
sudo dnf install nodejs npm

# Verificar instalación
node --version
npm --version
```

### Instalar dependencias del proyecto

```bash
# Asegúrate de estar en el directorio frontend
cd ~/ecommerce/frontend

# Instalar todas las dependencias
npm install
```

**Esto instalará:**
- React 18
- TypeScript 5
- Vite
- Material-UI
- Axios
- React Router
- React Query
- Y todas las demás dependencias

**Tiempo estimado:** 2-5 minutos dependiendo de la conexión.

---

## 6. Configurar y Ejecutar

### Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env
nano .env
# O usa vim si prefieres:
# vim .env
```

**Contenido del .env:**
```bash
VITE_API_URL=http://10.242.64.6:8080/api
```

Guarda y cierra el editor (Ctrl+X, luego Y, luego Enter en nano).

### Verificar configuración de Vite

El archivo `vite.config.ts` ya está configurado para:
- Escuchar en `0.0.0.0:3000` (accesible desde cualquier IP)
- Proxy al middleware en `10.242.64.6:8080`

### Iniciar el servidor de desarrollo

```bash
# Iniciar en modo desarrollo
npm run dev
```

**Salida esperada:**
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://10.242.64.7:3000/
  ➜  press h to show help
```

### Mantener el servidor corriendo

**Opción A: Dejar la terminal abierta**
- Simplemente deja la terminal SSH abierta
- El servidor seguirá corriendo mientras la terminal esté activa

**Opción B: Usar screen o tmux (recomendado)**

```bash
# Instalar screen si no lo tienes
sudo dnf install screen

# Crear una sesión de screen
screen -S frontend

# Dentro de screen, iniciar el servidor
npm run dev

# Desconectar de screen (servidor sigue corriendo)
# Presiona: Ctrl+A, luego D

# Para volver a conectarte más tarde
screen -r frontend

# Para listar sesiones activas
screen -ls
```

**Opción C: Usar PM2 (para producción)**

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar con PM2
pm2 start npm --name "ecommerce-frontend" -- run dev

# Ver logs
pm2 logs ecommerce-frontend

# Detener
pm2 stop ecommerce-frontend

# Reiniciar
pm2 restart ecommerce-frontend

# Configurar para que inicie al arrancar el servidor
pm2 startup
pm2 save
```

---

## 7. Verificación

### Verificar desde el servidor

```bash
# Hacer una petición local
curl http://localhost:3000

# Deberías ver el HTML de la aplicación
```

### Verificar desde tu navegador

1. Abre tu navegador
2. Ve a: `http://10.242.64.7:3000`
3. Deberías ver el Dashboard de la aplicación

### Verificar que el middleware está accesible

```bash
# Desde el servidor frontend, probar el middleware
curl http://10.242.64.6:8080/api/paises

# Deberías ver JSON con la lista de países
```

### Verificar funcionalidades

En el navegador, prueba:
- ✅ Dashboard carga correctamente
- ✅ Puedes navegar a Clientes
- ✅ Puedes navegar a Productos
- ✅ Puedes navegar a Países
- ✅ Puedes navegar a Carrito
- ✅ Las llamadas al API funcionan (verifica en la consola del navegador)

---

## 8. Solución de Problemas

### Problema: "Cannot find module 'react'"

**Solución:**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema: "EADDRINUSE: address already in use :::3000"

**Solución:**
```bash
# Ver qué proceso está usando el puerto 3000
sudo lsof -i :3000

# Matar el proceso (reemplaza PID con el número que viste)
kill -9 PID

# O cambiar el puerto en vite.config.ts
```

### Problema: "Failed to fetch" en el navegador

**Causas posibles:**
1. El middleware no está corriendo en 10.242.64.6:8080
2. Hay un problema de CORS
3. La URL del API en .env es incorrecta

**Solución:**
```bash
# Verificar que el middleware está corriendo
curl http://10.242.64.6:8080/api/paises

# Verificar el archivo .env
cat .env

# Verificar la configuración de proxy en vite.config.ts
cat vite.config.ts
```

### Problema: Errores de TypeScript

**Solución:**
```bash
# Limpiar caché de TypeScript
rm -rf node_modules/.vite
npm run dev
```

### Problema: El servidor se detiene al cerrar SSH

**Solución:**
Usa screen, tmux o PM2 como se explicó en la sección 6.

---

## 📊 Resumen de Comandos Rápidos

### En tu máquina local:
```bash
cd ~/Desktop/Ecommerce
git add frontend/
git commit -m "feat: Add frontend"
git push origin main
```

### En el servidor frontend (10.242.64.7):
```bash
# Clonar
git clone https://github.com/TU_USUARIO/TU_REPO.git ecommerce
cd ecommerce/frontend

# Generar archivos
python3 generar_todos_archivos.py

# Instalar y ejecutar
npm install
cp .env.example .env
npm run dev
```

### Acceder:
- Frontend: `http://10.242.64.7:3000`
- Middleware: `http://10.242.64.6:8080`

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, ahora deberías tener:
- ✅ Código en Git
- ✅ Proyecto clonado en el servidor
- ✅ Todos los archivos generados automáticamente
- ✅ Dependencias instaladas
- ✅ Servidor corriendo en http://10.242.64.7:3000
- ✅ Aplicación completamente funcional

---

## 📞 Soporte Adicional

Si encuentras algún problema no cubierto aquí:

1. Revisa los logs del servidor: `npm run dev` muestra errores en tiempo real
2. Revisa la consola del navegador (F12) para errores de JavaScript
3. Verifica que el middleware esté corriendo: `curl http://10.242.64.6:8080/api/paises`
4. Revisa los archivos de documentación: `PLAN.md`, `README.md`, `INSTRUCCIONES_GENERACION.md`

---

**Última actualización:** 2026-06-04