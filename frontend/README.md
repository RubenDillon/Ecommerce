# E-Commerce Frontend - React + TypeScript

Aplicación web moderna para el sistema de gestión de compras de bienes en internet, construida con React 18, TypeScript 5 y Material-UI.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación Rápida](#instalación-rápida)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Integración con Backend](#integración-con-backend)
- [Documentación](#documentación)

## ✨ Características

### Dashboard Interactivo
- 📊 Métricas en tiempo real (clientes, productos, valoración de stock)
- 🌤️ Clima actual de Argentina (integración con wttr.in)
- 🕐 Reloj en tiempo real
- 📈 Gráficos de distribución de productos por categoría

### Gestión Completa (CRUD)
- 👥 **Clientes**: Crear, editar, eliminar y buscar clientes
- 📦 **Productos**: Gestión completa con imágenes y categorías
- 🏷️ **Categorías**: Administración de tipos de productos
- 🌍 **Ubicaciones**: Gestión de países y ciudades

### Carrito de Compras Avanzado
- 🛒 Flujo de compra en 3 pasos
- 💰 Comparación con precios de referencia del mercado
- 📸 Visualización de productos con imágenes
- ✅ Validación de stock en tiempo real

### Características Técnicas
- 🎨 Diseño responsive con Material-UI
- 🌓 Modo claro/oscuro
- 🔍 Búsqueda y filtrado avanzado
- ⚡ Carga optimizada de imágenes
- 🔔 Notificaciones toast
- 💾 Persistencia local del carrito

## 🛠️ Tecnologías

### Core
- **React 18.2** - Biblioteca de UI con Hooks
- **TypeScript 5.3** - Tipado estático
- **Vite 5.0** - Build tool ultrarrápido

### UI/UX
- **Material-UI (MUI) 5.15** - Componentes de diseño
- **Material Icons** - Iconografía
- **Recharts 2.10** - Gráficos interactivos
- **React Toastify 9.1** - Notificaciones

### Estado y Datos
- **React Context API** - Gestión de estado global
- **React Query 5.12** - Gestión de estado del servidor
- **Axios 1.6** - Cliente HTTP

### Formularios y Validación
- **React Hook Form 7.49** - Manejo de formularios
- **Yup 1.3** - Validación de esquemas

### Routing
- **React Router 6.20** - Navegación SPA

### Utilidades
- **date-fns 2.30** - Manipulación de fechas
- **React Dropzone 14.2** - Upload de archivos

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                  10.242.64.7:3000                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Dashboard  │  │   Clientes   │  │  Productos   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Carrito    │  │  Ubicaciones │  │  Categorías  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │           Services (API Clients)                   ││
│  │  - clienteService  - productoService               ││
│  │  - ordenService    - weatherService                ││
│  └────────────────────────────────────────────────────┘│
│                          ↓                               │
└──────────────────────────┼───────────────────────────────┘
                           │ HTTP/REST
                           ↓
┌─────────────────────────────────────────────────────────┐
│              MIDDLEWARE (Quarkus)                        │
│                10.242.64.6:8080                          │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
User Action → Component → Service → API → Middleware → Database
                ↓                                          ↓
            Context API ←─────────── Response ←───────────┘
                ↓
            UI Update
```

## 📦 Requisitos

- **Node.js**: 18.x o superior
- **npm**: 9.x o superior
- **Sistema Operativo**: Red Hat Enterprise Linux 9
- **Middleware**: Quarkus ejecutándose en 10.242.64.6:8080
- **Navegador**: Chrome, Firefox, Safari o Edge (últimas versiones)

## 🚀 Instalación Rápida

```bash
# 1. Clonar o copiar el proyecto
cd /opt/ecommerce/frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del middleware

# 4. Iniciar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://10.242.64.7:3000
```

Para instalación detallada, ver [INSTALL.md](./INSTALL.md)

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── common/         # Componentes reutilizables
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ...
│   │   ├── layout/         # Layout principal
│   │   │   └── MainLayout.tsx
│   │   ├── clientes/       # Componentes de clientes
│   │   ├── productos/      # Componentes de productos
│   │   └── carrito/        # Componentes del carrito
│   │
│   ├── pages/              # Páginas principales
│   │   ├── Dashboard.tsx
│   │   ├── Clientes.tsx
│   │   ├── Productos.tsx
│   │   ├── Carrito.tsx
│   │   └── ...
│   │
│   ├── services/           # Servicios de API
│   │   ├── api.ts          # Cliente Axios
│   │   ├── clienteService.ts
│   │   ├── productoService.ts
│   │   ├── weatherService.ts
│   │   └── ...
│   │
│   ├── contexts/           # Contextos de React
│   │   ├── AppContext.tsx
│   │   └── CarritoContext.tsx
│   │
│   ├── hooks/              # Custom Hooks
│   │   ├── useAsync.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   │
│   ├── types/              # Definiciones TypeScript
│   │   └── index.ts
│   │
│   ├── utils/              # Utilidades
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── storage.ts
│   │
│   ├── App.tsx             # Componente raíz
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
│
├── public/                 # Assets estáticos
├── index.html              # HTML principal
├── package.json            # Dependencias
├── tsconfig.json           # Config TypeScript
├── vite.config.ts          # Config Vite
├── .env.example            # Variables de entorno
├── PLAN.md                 # Plan de arquitectura
├── INSTALL.md              # Guía de instalación
├── README.md               # Este archivo
└── CODIGO_COMPLETO_*.md    # Código fuente completo
```

## 🎯 Funcionalidades

### 1. Dashboard

**Métricas Principales:**
- Total de clientes registrados
- Total de productos en inventario
- Valoración total del stock
- Hora actual de Argentina

**Widgets:**
- Clima actual de Buenos Aires
- Gráfico de productos por categoría
- Resumen de categorías con contadores

**Servicios Integrados:**
- wttr.in para clima (sin API key)
- Actualización de hora en tiempo real

### 2. Gestión de Clientes

**Funcionalidades:**
- ✅ Crear nuevo cliente
- ✅ Editar cliente existente
- ✅ Eliminar cliente (con confirmación)
- ✅ Buscar por nombre, email o teléfono
- ✅ Selección de país y ciudad (dependiente)
- ✅ Validación de email y teléfono

**Campos:**
- Nombre, Dirección, País, Ciudad, Teléfono, Email

### 3. Gestión de Productos

**Funcionalidades:**
- ✅ CRUD completo de productos
- ✅ Selector de imágenes con sugerencias
- ✅ Upload de imágenes personalizadas
- ✅ Filtrado por categoría
- ✅ Búsqueda por nombre o SKU
- ✅ Visualización de stock

**Selector de Imágenes:**
- 10 sugerencias automáticas según categoría
- Integración con Unsplash
- Opción de upload manual
- Vista previa de imagen

**Campos:**
- Nombre, SKU, Categoría, Stock, Imagen, Costo, Precio de Venta

### 4. Carrito de Compras

**Flujo de 3 Pasos:**

**Paso 1: Seleccionar Cliente**
- Búsqueda de clientes existentes
- Selección de cliente para la compra

**Paso 2: Agregar Productos**
- Visualización de productos con imágenes
- Filtrado por categoría
- Comparación con precios de referencia del mercado
- Indicador de mejor precio (✓/✗)
- Selección de cantidad
- Validación de stock

**Paso 3: Confirmar Compra**
- Resumen de productos seleccionados
- Ajuste de cantidades
- Eliminación de items
- Cálculo de total
- Finalización de compra

**Características:**
- Persistencia en LocalStorage
- Validación de stock en tiempo real
- Cálculo automático de totales
- Notificaciones de éxito/error

### 5. Gestión de Ubicaciones

**Países:**
- CRUD completo
- Validación de eliminación (no se puede eliminar si tiene ciudades)

**Ciudades:**
- CRUD completo
- Filtrado por país
- Validación de eliminación (no se puede eliminar si tiene clientes)

### 6. Gestión de Categorías

**Clases/Tipos:**
- CRUD completo
- Validación de eliminación (no se puede eliminar si tiene productos)

## 🔌 Integración con Backend

### Endpoints Utilizados

```typescript
// Países
GET    /api/paises
GET    /api/paises/{id}
POST   /api/paises
PUT    /api/paises/{id}
DELETE /api/paises/{id}

// Ciudades
GET    /api/ciudades
GET    /api/ciudades/{id}
GET    /api/ciudades/pais/{idPais}
POST   /api/ciudades
PUT    /api/ciudades/{id}
DELETE /api/ciudades/{id}

// Clientes
GET    /api/clientes
GET    /api/clientes/{id}
GET    /api/clientes/search?q={query}
POST   /api/clientes
PUT    /api/clientes/{id}
DELETE /api/clientes/{id}

// Productos
GET    /api/productos
GET    /api/productos/{id}
GET    /api/productos/clase/{idTipo}
GET    /api/productos/search?q={query}
POST   /api/productos
PUT    /api/productos/{id}
DELETE /api/productos/{id}

// Clases
GET    /api/clases
GET    /api/clases/{id}
POST   /api/clases
PUT    /api/clases/{id}
DELETE /api/clases/{id}

// Órdenes
GET    /api/ordenes
GET    /api/ordenes/{id}
GET    /api/ordenes/cliente/{idCliente}
POST   /api/ordenes
DELETE /api/ordenes/{id}
```

### Configuración CORS

El middleware debe permitir:
- Origin: `http://10.242.64.7:3000`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

## 📚 Documentación

### Archivos de Documentación

- **[PLAN.md](./PLAN.md)** - Arquitectura y diseño del sistema
- **[INSTALL.md](./INSTALL.md)** - Guía de instalación paso a paso
- **[CODIGO_COMPLETO_PARTE1.md](./CODIGO_COMPLETO_PARTE1.md)** - Types, Services, Utils
- **[CODIGO_COMPLETO_PARTE2.md](./CODIGO_COMPLETO_PARTE2.md)** - Contexts, Hooks, Common Components
- **[CODIGO_COMPLETO_PARTE3.md](./CODIGO_COMPLETO_PARTE3.md)** - Layout, Dashboard, Clientes
- **[CODIGO_COMPLETO_PARTE4.md](./CODIGO_COMPLETO_PARTE4.md)** - Productos, Carrito
- **[CODIGO_COMPLETO_PARTE5.md](./CODIGO_COMPLETO_PARTE5.md)** - Componentes finales, App, Config

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run preview      # Vista previa del build

# Calidad de Código
npm run lint         # Verificar errores de ESLint
npx tsc --noEmit     # Verificar errores de TypeScript
```

## 🔧 Configuración

### Variables de Entorno

```bash
# .env
VITE_API_URL=http://10.242.64.6:8080/api
```

### Configuración de Vite

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://10.242.64.6:8080',
        changeOrigin: true,
      },
    },
  },
});
```

## 🎨 Temas y Estilos

### Modo Claro/Oscuro

La aplicación soporta modo claro y oscuro:
- Toggle en la barra superior
- Persistencia en LocalStorage
- Transiciones suaves

### Paleta de Colores

```typescript
primary: '#1976d2'    // Azul
secondary: '#dc004e'  // Rosa
success: '#2e7d32'    // Verde
error: '#d32f2f'      // Rojo
warning: '#ed6c02'    // Naranja
info: '#0288d1'       // Azul claro
```

## 🔒 Seguridad

### Validaciones Implementadas

- ✅ Validación de email (regex)
- ✅ Validación de teléfono (formato argentino)
- ✅ Validación de campos requeridos
- ✅ Validación de rangos numéricos
- ✅ Sanitización de inputs

### Buenas Prácticas

- No se almacenan datos sensibles en LocalStorage
- Validación en cliente y servidor
- Manejo seguro de errores
- HTTPS recomendado para producción

## 🚀 Despliegue

### Desarrollo

```bash
npm run dev
# Acceder a http://10.242.64.7:3000
```

### Producción con Nginx

```bash
# 1. Compilar
npm run build

# 2. Configurar nginx (ver INSTALL.md)
# 3. Copiar archivos de dist/ a /var/www/html
# 4. Acceder a http://10.242.64.7
```

## 🐛 Solución de Problemas

### Error: Cannot connect to middleware

```bash
# Verificar que el middleware está ejecutándose
curl http://10.242.64.6:8080/api/paises

# Verificar configuración CORS en el middleware
```

### Error: Port 3000 already in use

```bash
# Encontrar y matar proceso
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Error: Module not found

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📈 Rendimiento

### Optimizaciones Implementadas

- ✅ Lazy loading de componentes
- ✅ Debouncing en búsquedas (500ms)
- ✅ Memoización de cálculos costosos
- ✅ Virtualización de listas largas
- ✅ Compresión de assets en build
- ✅ Code splitting automático

### Métricas

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: ~500KB (gzipped)

## 🤝 Contribución

Este es un proyecto educativo. Para mejoras:

1. Seguir la estructura de carpetas existente
2. Usar TypeScript para todo el código
3. Documentar funciones complejas
4. Mantener componentes pequeños y reutilizables
5. Escribir código limpio y legible

## 📄 Licencia

Proyecto educativo - Red Hat Enterprise Linux 9

## 👥 Autores

Desarrollado como parte del sistema E-Commerce de 3 capas:
- Backend: MySQL 8.0 en RHEL 9
- Middleware: Quarkus 3.6 en RHEL 9
- Frontend: React 18 + TypeScript en RHEL 9

---

**Estado del Proyecto**: ✅ Completado y funcional

**Última Actualización**: Junio 2026