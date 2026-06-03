# Guía de Instalación - Frontend E-Commerce

Esta guía detalla el proceso completo de instalación del frontend React + TypeScript en Red Hat Enterprise Linux 9.

## Información del Servidor

- **IP**: 10.242.64.7
- **Sistema Operativo**: Red Hat Enterprise Linux 9
- **Puerto**: 3000
- **Middleware**: http://10.242.64.6:8080

## Requisitos Previos

- Red Hat Enterprise Linux 9
- Acceso root o sudo
- Conexión a internet
- Middleware Quarkus ejecutándose en 10.242.64.6:8080

## Paso 1: Instalar Node.js y npm

### 1.1. Habilitar repositorio de Node.js

```bash
# Conectarse al servidor
ssh root@10.242.64.7

# Instalar el repositorio de NodeSource para Node.js 18 LTS
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# Verificar que el repositorio se agregó correctamente
sudo dnf repolist | grep nodesource
```

### 1.2. Instalar Node.js

```bash
# Instalar Node.js y npm
sudo dnf install -y nodejs

# Verificar la instalación
node --version  # Debe mostrar v18.x.x
npm --version   # Debe mostrar 9.x.x o superior
```

### 1.3. Instalar herramientas de desarrollo (opcional pero recomendado)

```bash
# Instalar herramientas de compilación
sudo dnf groupinstall -y "Development Tools"

# Instalar git si no está instalado
sudo dnf install -y git
```

## Paso 2: Preparar el Directorio del Proyecto

### 2.1. Crear estructura de directorios

```bash
# Crear directorio para el proyecto
sudo mkdir -p /opt/ecommerce/frontend
cd /opt/ecommerce/frontend

# Establecer permisos
sudo chown -R $USER:$USER /opt/ecommerce/frontend
```

### 2.2. Copiar archivos del proyecto

Opción A: Si tienes los archivos localmente, usa SCP:

```bash
# Desde tu máquina local
scp -r Ecommerce/frontend/* root@10.242.64.7:/opt/ecommerce/frontend/
```

Opción B: Crear archivos manualmente siguiendo la estructura del proyecto.

## Paso 3: Configurar el Proyecto

### 3.1. Crear archivo de configuración

```bash
cd /opt/ecommerce/frontend

# Crear archivo .env
cat > .env << 'EOF'
VITE_API_URL=http://10.242.64.6:8080/api
EOF
```

### 3.2. Verificar estructura de archivos

```bash
# Verificar que existen los archivos principales
ls -la

# Deberías ver:
# - package.json
# - tsconfig.json
# - vite.config.ts
# - index.html
# - src/
# - .env
```

## Paso 4: Instalar Dependencias

### 4.1. Instalar paquetes npm

```bash
cd /opt/ecommerce/frontend

# Instalar todas las dependencias
npm install

# Este proceso puede tomar varios minutos
# Descargará aproximadamente 200-300 MB de paquetes
```

### 4.2. Verificar instalación

```bash
# Verificar que node_modules se creó
ls -la node_modules/

# Verificar que las dependencias principales están instaladas
npm list react react-dom typescript vite
```

## Paso 5: Configurar Firewall

### 5.1. Abrir puerto 3000

```bash
# Agregar regla para el puerto 3000
sudo firewall-cmd --permanent --add-port=3000/tcp

# Recargar firewall
sudo firewall-cmd --reload

# Verificar que el puerto está abierto
sudo firewall-cmd --list-ports
```

### 5.2. Configurar SELinux (si está habilitado)

```bash
# Verificar estado de SELinux
getenforce

# Si está en modo Enforcing, configurar contexto
sudo semanage port -a -t http_port_t -p tcp 3000

# O temporalmente poner en modo permisivo (no recomendado para producción)
# sudo setenforce 0
```

## Paso 6: Ejecutar en Modo Desarrollo

### 6.1. Iniciar servidor de desarrollo

```bash
cd /opt/ecommerce/frontend

# Iniciar en modo desarrollo
npm run dev

# El servidor iniciará en http://10.242.64.7:3000
# Verás un mensaje similar a:
#   VITE v5.0.8  ready in 1234 ms
#   ➜  Local:   http://localhost:3000/
#   ➜  Network: http://10.242.64.7:3000/
```

### 6.2. Verificar acceso

Desde otra máquina en la red:

```bash
# Verificar conectividad
curl http://10.242.64.7:3000

# O abrir en navegador
# http://10.242.64.7:3000
```

## Paso 7: Build para Producción

### 7.1. Compilar aplicación

```bash
cd /opt/ecommerce/frontend

# Compilar para producción
npm run build

# Los archivos compilados estarán en dist/
ls -la dist/
```

### 7.2. Instalar servidor web (nginx)

```bash
# Instalar nginx
sudo dnf install -y nginx

# Iniciar y habilitar nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 7.3. Configurar nginx

```bash
# Crear configuración para el frontend
sudo tee /etc/nginx/conf.d/ecommerce-frontend.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name 10.242.64.7;
    root /opt/ecommerce/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://10.242.64.6:8080/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Verificar configuración
sudo nginx -t

# Recargar nginx
sudo systemctl reload nginx
```

### 7.4. Configurar firewall para HTTP

```bash
# Abrir puerto 80
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

## Paso 8: Crear Servicio Systemd (Opcional - para desarrollo)

### 8.1. Crear archivo de servicio

```bash
sudo tee /etc/systemd/system/ecommerce-frontend.service > /dev/null << 'EOF'
[Unit]
Description=E-Commerce Frontend Development Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ecommerce/frontend
Environment="NODE_ENV=development"
ExecStart=/usr/bin/npm run dev
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

### 8.2. Habilitar y iniciar servicio

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio
sudo systemctl enable ecommerce-frontend

# Iniciar servicio
sudo systemctl start ecommerce-frontend

# Verificar estado
sudo systemctl status ecommerce-frontend

# Ver logs
sudo journalctl -u ecommerce-frontend -f
```

## Paso 9: Verificación Final

### 9.1. Verificar servicios

```bash
# Verificar que Node.js está ejecutándose
ps aux | grep node

# Verificar puerto 3000
sudo netstat -tlnp | grep 3000

# O con ss
sudo ss -tlnp | grep 3000
```

### 9.2. Probar conectividad con middleware

```bash
# Desde el servidor frontend
curl http://10.242.64.6:8080/api/paises

# Debería retornar JSON con la lista de países
```

### 9.3. Acceder a la aplicación

Abrir navegador y acceder a:
- Desarrollo: `http://10.242.64.7:3000`
- Producción: `http://10.242.64.7`

## Paso 10: Monitoreo y Logs

### 10.1. Ver logs de desarrollo

```bash
# Si ejecutaste npm run dev directamente
# Los logs aparecerán en la terminal

# Si usaste systemd
sudo journalctl -u ecommerce-frontend -f
```

### 10.2. Ver logs de nginx (producción)

```bash
# Logs de acceso
sudo tail -f /var/log/nginx/access.log

# Logs de error
sudo tail -f /var/log/nginx/error.log
```

## Solución de Problemas

### Problema: npm install falla

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Problema: Puerto 3000 en uso

```bash
# Encontrar proceso usando el puerto
sudo lsof -i :3000

# Matar proceso
sudo kill -9 <PID>
```

### Problema: No se puede conectar al middleware

```bash
# Verificar que el middleware está ejecutándose
curl http://10.242.64.6:8080/api/paises

# Verificar firewall en el servidor middleware
ssh root@10.242.64.6 "sudo firewall-cmd --list-ports"

# Verificar configuración CORS en el middleware
# Debe permitir origen: http://10.242.64.7:3000
```

### Problema: Errores de TypeScript

```bash
# Verificar versión de TypeScript
npx tsc --version

# Limpiar y recompilar
rm -rf dist/
npm run build
```

### Problema: Módulos no encontrados

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar que todas las dependencias están instaladas
npm list
```

## Comandos Útiles

```bash
# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de build
npm run preview

# Verificar errores de TypeScript
npx tsc --noEmit

# Verificar formato de código
npm run lint

# Ver logs del servicio
sudo journalctl -u ecommerce-frontend -f

# Reiniciar servicio
sudo systemctl restart ecommerce-frontend

# Detener servicio
sudo systemctl stop ecommerce-frontend
```

## Mantenimiento

### Actualizar dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas las dependencias
npm update

# Actualizar dependencia específica
npm install <package>@latest
```

### Backup

```bash
# Crear backup del proyecto
sudo tar -czf /backup/ecommerce-frontend-$(date +%Y%m%d).tar.gz /opt/ecommerce/frontend

# Excluir node_modules del backup
sudo tar --exclude='node_modules' -czf /backup/ecommerce-frontend-$(date +%Y%m%d).tar.gz /opt/ecommerce/frontend
```

## Seguridad

### Recomendaciones

1. **No ejecutar como root en producción**
```bash
# Crear usuario específico
sudo useradd -r -s /bin/false ecommerce

# Cambiar propietario
sudo chown -R ecommerce:ecommerce /opt/ecommerce/frontend
```

2. **Configurar HTTPS con certificado SSL**
```bash
# Instalar certbot
sudo dnf install -y certbot python3-certbot-nginx

# Obtener certificado (requiere dominio)
sudo certbot --nginx -d tudominio.com
```

3. **Configurar variables de entorno seguras**
```bash
# No incluir información sensible en .env
# Usar variables de entorno del sistema
```

## Próximos Pasos

1. Configurar monitoreo con herramientas como PM2
2. Implementar CI/CD para despliegues automáticos
3. Configurar balanceo de carga si es necesario
4. Implementar caché de assets estáticos
5. Configurar CDN para mejor rendimiento

## Soporte

Para problemas o consultas:
- Revisar logs: `sudo journalctl -u ecommerce-frontend`
- Verificar conectividad: `curl http://10.242.64.6:8080/api/paises`
- Revisar documentación de Vite: https://vitejs.dev
- Revisar documentación de React: https://react.dev

---

**Instalación completada exitosamente** ✅

La aplicación frontend está lista para usar en:
- Desarrollo: http://10.242.64.7:3000
- Producción: http://10.242.64.7