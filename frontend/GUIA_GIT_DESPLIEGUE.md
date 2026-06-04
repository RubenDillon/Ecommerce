# Guía: Subir a GitHub y Desplegar en Servidor Frontend

Esta guía te muestra exactamente cómo subir el proyecto desde tu máquina local a GitHub y luego desplegarlo en el servidor frontend (10.242.64.7).

---

## 📋 Resumen del Proceso

1. **En tu máquina local (Desktop):** Subir a GitHub
2. **En el servidor frontend (10.242.64.7):** Clonar y ejecutar

---

## PARTE 1: Subir a GitHub desde tu Máquina Local

### Paso 1: Preparar el repositorio local

```bash
# Ir al directorio del proyecto
cd ~/Desktop/Ecommerce

# Verificar estado de Git
git status
```

### Paso 2: Agregar archivos al staging

```bash
# Agregar SOLO el directorio frontend
git add frontend/

# Verificar qué se va a subir
git status
```

Deberías ver algo como:
```
Changes to be committed:
  new file:   frontend/generar_todos_archivos.py
  new file:   frontend/COMANDOS_RAPIDOS.sh
  new file:   frontend/DESPLIEGUE_COMPLETO.md
  new file:   frontend/CODIGO_COMPLETO_PARTE1.md
  ... (y muchos más archivos)
```

### Paso 3: Hacer commit

```bash
git commit -m "feat: Add complete frontend with auto-generator scripts

- Added generar_todos_archivos.py: Auto-generates all frontend files
- Added COMANDOS_RAPIDOS.sh: Quick commands menu
- Added DESPLIEGUE_COMPLETO.md: Complete deployment guide
- Added all CODIGO_COMPLETO_PARTE*.md files with full code
- Added package.json with all dependencies
- Added TypeScript and Vite configuration
- Ready for deployment on 10.242.64.7:3000"
```

### Paso 4: Push a GitHub

```bash
# Si ya tienes el remote configurado:
git push origin main

# Si tu rama principal es 'master':
git push origin master

# Si es la primera vez que subes este branch:
git push -u origin main
```

### Paso 5: Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a la carpeta `frontend/`
3. Verifica que veas todos estos archivos:
   - ✅ `generar_todos_archivos.py`
   - ✅ `COMANDOS_RAPIDOS.sh`
   - ✅ `DESPLIEGUE_COMPLETO.md`
   - ✅ `CODIGO_COMPLETO_PARTE1.md` hasta `PARTE5.md`
   - ✅ `package.json`
   - ✅ `tsconfig.json`
   - ✅ `vite.config.ts`
   - ✅ `.env.example`
   - ✅ `.gitignore`
   - ✅ `index.html`

---

## PARTE 2: Desplegar en el Servidor Frontend

### Paso 1: Conectarse al servidor

```bash
ssh usuario@10.242.64.7
# Ingresa tu contraseña
```

### Paso 2: Clonar el repositorio

```bash
# Ir al directorio home
cd ~

# Clonar el repositorio (reemplaza con tu URL)
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git ecommerce

# Si usas SSH:
# git clone git@github.com:TU_USUARIO/TU_REPOSITORIO.git ecommerce

# Entrar al directorio frontend
cd ecommerce/frontend
```

### Paso 3: Verificar archivos descargados

```bash
# Listar archivos importantes
ls -la

# Deberías ver:
# - generar_todos_archivos.py
# - COMANDOS_RAPIDOS.sh
# - CODIGO_COMPLETO_PARTE*.md
# - package.json
# - etc.
```

### Paso 4: Dar permisos de ejecución a los scripts

```bash
chmod +x generar_todos_archivos.py
chmod +x COMANDOS_RAPIDOS.sh
```

### Paso 5: Ejecutar el setup completo

**Opción A: Usar el script de comandos rápidos (RECOMENDADO)**

```bash
# Ejecutar el menú interactivo
./COMANDOS_RAPIDOS.sh

# Selecciona la opción 9: "Setup completo"
# Esto hará automáticamente:
# - Generar todos los archivos
# - Instalar dependencias
# - Configurar .env
```

**Opción B: Ejecutar manualmente paso a paso**

```bash
# 1. Generar todos los archivos
python3 generar_todos_archivos.py

# 2. Instalar dependencias
npm install

# 3. Configurar .env
cp .env.example .env
# Editar si es necesario:
nano .env
```

### Paso 6: Iniciar el servidor

**Opción A: Modo desarrollo (para pruebas)**

```bash
npm run dev
```

**Opción B: Con screen (para mantenerlo corriendo)**

```bash
# Instalar screen si no lo tienes
sudo dnf install screen

# Crear sesión
screen -S frontend

# Dentro de screen, iniciar servidor
npm run dev

# Desconectar (Ctrl+A, luego D)
# El servidor seguirá corriendo

# Para reconectar más tarde:
screen -r frontend
```

**Opción C: Con PM2 (para producción)**

```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar con PM2
pm2 start npm --name "ecommerce-frontend" -- run dev

# Ver logs
pm2 logs ecommerce-frontend

# Configurar para inicio automático
pm2 startup
pm2 save
```

### Paso 7: Verificar que funciona

```bash
# Desde el servidor, probar localmente
curl http://localhost:3000

# Deberías ver HTML de la aplicación
```

Desde tu navegador:
- Ve a: `http://10.242.64.7:3000`
- Deberías ver el Dashboard de la aplicación

---

## 🔄 Actualizar el Código (cuando hagas cambios)

### En tu máquina local:

```bash
cd ~/Desktop/Ecommerce

# Hacer cambios en los archivos...

# Agregar cambios
git add frontend/

# Commit
git commit -m "descripción de los cambios"

# Push
git push origin main
```

### En el servidor frontend:

```bash
cd ~/ecommerce/frontend

# Detener el servidor si está corriendo
# (Ctrl+C si está en primer plano, o pm2 stop si usas PM2)

# Actualizar código
git pull origin main

# Si hay cambios en package.json, reinstalar
npm install

# Reiniciar servidor
npm run dev
# O si usas PM2:
# pm2 restart ecommerce-frontend
```

---

## 📊 Resumen de Comandos

### En tu máquina local (una sola vez):
```bash
cd ~/Desktop/Ecommerce
git add frontend/
git commit -m "feat: Add complete frontend"
git push origin main
```

### En el servidor frontend (primera vez):
```bash
# Conectar
ssh usuario@10.242.64.7

# Clonar
cd ~
git clone https://github.com/TU_USUARIO/TU_REPO.git ecommerce
cd ecommerce/frontend

# Setup
chmod +x *.sh *.py
./COMANDOS_RAPIDOS.sh
# Seleccionar opción 9 (Setup completo)

# Iniciar
npm run dev
```

### Acceder:
- Frontend: `http://10.242.64.7:3000`

---

## ✅ Checklist de Verificación

### Antes de subir a GitHub:
- [ ] Estás en el directorio correcto (`~/Desktop/Ecommerce`)
- [ ] Ejecutaste `git add frontend/`
- [ ] Hiciste commit con un mensaje descriptivo
- [ ] Ejecutaste `git push`
- [ ] Verificaste en GitHub que los archivos están ahí

### En el servidor frontend:
- [ ] Te conectaste por SSH a 10.242.64.7
- [ ] Clonaste el repositorio
- [ ] Diste permisos de ejecución a los scripts
- [ ] Ejecutaste el setup (opción 9 del menú o manual)
- [ ] El servidor está corriendo
- [ ] Puedes acceder desde el navegador a http://10.242.64.7:3000

---

## 🆘 Solución de Problemas

### "Permission denied" al hacer git push

```bash
# Verifica tu autenticación con GitHub
ssh -T git@github.com

# Si falla, configura tu SSH key o usa HTTPS
```

### "fatal: not a git repository"

```bash
# Inicializa el repositorio
cd ~/Desktop/Ecommerce
git init
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

### "npm: command not found" en el servidor

```bash
# Instalar Node.js en Red Hat 9
sudo dnf module enable nodejs:18
sudo dnf install nodejs npm
```

### El servidor se detiene al cerrar SSH

Usa `screen` o `PM2` como se explicó en el Paso 6.

### "EADDRINUSE: address already in use :::3000"

```bash
# Ver qué está usando el puerto
sudo lsof -i :3000

# Matar el proceso
kill -9 PID
```

---

## 📞 Comandos Útiles

### Ver logs del servidor:
```bash
# Si usas npm run dev, los logs aparecen en la terminal

# Si usas PM2:
pm2 logs ecommerce-frontend

# Ver logs en tiempo real:
pm2 logs ecommerce-frontend --lines 100
```

### Detener el servidor:
```bash
# Si está en primer plano: Ctrl+C

# Si usas screen:
screen -r frontend
# Luego Ctrl+C

# Si usas PM2:
pm2 stop ecommerce-frontend
```

### Reiniciar el servidor:
```bash
# Con PM2:
pm2 restart ecommerce-frontend

# Manual:
# Detener (Ctrl+C) y luego:
npm run dev
```

---

## 🎉 ¡Listo!

Siguiendo esta guía deberías tener:
- ✅ Código en GitHub
- ✅ Proyecto clonado en 10.242.64.7
- ✅ Todos los archivos generados automáticamente
- ✅ Dependencias instaladas
- ✅ Servidor corriendo
- ✅ Aplicación accesible en http://10.242.64.7:3000

---

**Última actualización:** 2026-06-04