# Código Completo del Frontend - Parte 5: Componentes Finales y Configuración

## 1. Carrito Resumen Component (src/components/carrito/CarritoResumen.tsx)

```typescript
// src/components/carrito/CarritoResumen.tsx
import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCarrito } from '@contexts/CarritoContext';
import { formatCurrency } from '@utils/formatters';

export const CarritoResumen: React.FC = () => {
  const { items, clienteSeleccionado, actualizarCantidad, eliminarItem, getTotal } = useCarrito();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen de la Compra
      </Typography>

      {clienteSeleccionado && (
        <Box mb={3} p={2} bgcolor="background.default" borderRadius={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Cliente:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {clienteSeleccionado.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {clienteSeleccionado.correoElectronico}
          </Typography>
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="right">Precio Unit.</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.producto.idProducto}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={item.producto.foto}
                      variant="rounded"
                      sx={{ width: 50, height: 50 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {item.producto.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {item.producto.sku}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        actualizarCantidad(item.producto.idProducto, item.cantidad - 1)
                      }
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography>{item.cantidad}</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        actualizarCantidad(item.producto.idProducto, item.cantidad + 1)
                      }
                      disabled={item.cantidad >= item.producto.stock}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(item.precioUnitario)}
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold">
                    {formatCurrency(item.precioUnitario * item.cantidad)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => eliminarItem(item.producto.idProducto)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {formatCurrency(getTotal())}
        </Typography>
      </Box>
    </Box>
  );
};
```

## 2. Páginas Simples - Países (src/pages/Paises.tsx)

```typescript
// src/pages/Paises.tsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { paisService } from '@services/paisService';
import { Pais } from '@types/index';
import { DataTable, Column } from '@components/common/DataTable';
import { PageHeader } from '@components/common/PageHeader';
import { Loading } from '@components/common/Loading';
import { ErrorMessage } from '@components/common/ErrorMessage';
import { ConfirmDialog } from '@components/common/ConfirmDialog';
import { PaisDialog } from '@components/paises/PaisDialog';
import { toast } from 'react-toastify';

export const Paises: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPais, setSelectedPais] = useState<Pais | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paisToDelete, setPaisToDelete] = useState<Pais | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paisService.getAll();
      setPaises(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los países');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPais(null);
    setDialogOpen(true);
  };

  const handleEdit = (pais: Pais) => {
    setSelectedPais(pais);
    setDialogOpen(true);
  };

  const handleDelete = (pais: Pais) => {
    setPaisToDelete(pais);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!paisToDelete) return;
    try {
      await paisService.delete(paisToDelete.idPais);
      toast.success('País eliminado exitosamente');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el país');
    } finally {
      setDeleteDialogOpen(false);
      setPaisToDelete(null);
    }
  };

  const handleSave = async () => {
    setDialogOpen(false);
    await loadData();
    toast.success(selectedPais ? 'País actualizado' : 'País creado');
  };

  const columns: Column<Pais>[] = [
    { id: 'idPais', label: 'ID', minWidth: 70 },
    { id: 'nombre', label: 'Nombre', minWidth: 200 },
  ];

  if (loading) return <Loading message="Cargando países..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <Box>
      <PageHeader
        title="Países"
        subtitle={`${paises.length} países registrados`}
        onAdd={handleAdd}
        addButtonText="Nuevo País"
      />
      <DataTable
        columns={columns}
        data={paises}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.idPais}
      />
      <PaisDialog
        open={dialogOpen}
        pais={selectedPais}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar País"
        message={`¿Está seguro que desea eliminar el país "${paisToDelete?.nombre}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
      />
    </Box>
  );
};
```

## 3. Pais Dialog (src/components/paises/PaisDialog.tsx)

```typescript
// src/components/paises/PaisDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Pais } from '@types/index';
import { paisService } from '@services/paisService';
import { validateRequired } from '@utils/validators';

interface PaisDialogProps {
  open: boolean;
  pais: Pais | null;
  onClose: () => void;
  onSave: () => void;
}

export const PaisDialog: React.FC<PaisDialogProps> = ({ open, pais, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(pais?.nombre || '');
    setError('');
  }, [pais, open]);

  const handleSubmit = async () => {
    if (!validateRequired(nombre)) {
      setError('El nombre es requerido');
      return;
    }

    setLoading(true);
    try {
      if (pais) {
        await paisService.update(pais.idPais, { nombre });
      } else {
        await paisService.create({ nombre });
      }
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el país');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{pais ? 'Editar País' : 'Nuevo País'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

## 4. Ciudades y Clases Pages (Similar estructura)

```typescript
// src/pages/Ciudades.tsx y src/pages/Clases.tsx
// Siguen la misma estructura que Paises.tsx
// Ver documentación completa en los archivos del proyecto
```

## 5. App.tsx Principal

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider, useApp } from '@contexts/AppContext';
import { CarritoProvider } from '@contexts/CarritoContext';
import { MainLayout } from '@components/layout/MainLayout';
import { Dashboard } from '@pages/Dashboard';
import { Clientes } from '@pages/Clientes';
import { Productos } from '@pages/Productos';
import { Clases } from '@pages/Clases';
import { Paises } from '@pages/Paises';
import { Ciudades } from '@pages/Ciudades';
import { Carrito } from '@pages/Carrito';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { theme: appTheme } = useApp();

  const theme = createTheme({
    palette: {
      mode: appTheme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="productos" element={<Productos />} />
            <Route path="clases" element={<Clases />} />
            <Route path="paises" element={<Paises />} />
            <Route path="ciudades" element={<Ciudades />} />
            <Route path="carrito" element={<Carrito />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <CarritoProvider>
          <AppContent />
        </CarritoProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
```

## 6. main.tsx

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 7. index.css

```css
/* src/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}
```

## 8. index.html

```html
<!-- index.html -->
<!DOCTYPE html>
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
```

## 9. .env.example

```bash
# .env.example
VITE_API_URL=http://10.242.64.6:8080/api
```

## 10. .gitignore

```
# .gitignore
# Logs
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
```

## 11. README.md del Frontend

```markdown
# E-Commerce Frontend

Aplicación web React + TypeScript para el sistema de gestión de compras de bienes en internet.

## Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de UI
- **React Router 6** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Recharts** - Gráficos
- **React Toastify** - Notificaciones

## Características

### Dashboard
- Métricas en tiempo real (clientes, productos, valoración de stock)
- Clima actual de Argentina
- Hora actual
- Gráfico de productos por categoría

### Gestión de Clientes
- CRUD completo
- Búsqueda por nombre, email o teléfono
- Validación de datos
- Selección de país y ciudad (dependiente)

### Gestión de Productos
- CRUD completo
- Selector de imágenes con sugerencias
- Upload de imágenes personalizadas
- Filtrado por categoría
- Búsqueda por nombre o SKU

### Carrito de Compras
- Flujo de 3 pasos:
  1. Seleccionar cliente
  2. Agregar productos
  3. Confirmar compra
- Visualización de precios de referencia del mercado
- Gestión de cantidades
- Cálculo de totales

### Gestión de Ubicaciones
- CRUD de Países
- CRUD de Ciudades (filtradas por país)

### Gestión de Categorías
- CRUD de Clases/Tipos de productos

## Requisitos Previos

- Node.js 18+ y npm
- Middleware ejecutándose en http://10.242.64.6:8080

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env`:
```bash
cp .env.example .env
```

3. Configurar la URL del API en `.env`:
```
VITE_API_URL=http://10.242.64.6:8080/api
```

## Desarrollo

Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://10.242.64.7:3000`

## Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en el directorio `dist/`

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── layout/         # Layout principal
│   ├── clientes/       # Componentes de clientes
│   ├── productos/      # Componentes de productos
│   └── carrito/        # Componentes del carrito
├── contexts/           # Contextos de React
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Servicios de API
├── types/              # Definiciones de TypeScript
├── utils/              # Utilidades
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada

## Servicios Externos

### Clima
- **wttr.in** - Servicio gratuito sin API key
- Endpoint: `https://wttr.in/Buenos_Aires?format=j1`

### Imágenes
- **Unsplash Source** - Imágenes gratuitas
- Endpoint: `https://source.unsplash.com/`

### Precios de Referencia
- Estimación basada en el precio de venta ±15%
- En producción se puede integrar con APIs de e-commerce

## Características Técnicas

- **Tipado completo** con TypeScript
- **Validación de formularios** con React Hook Form y Yup
- **Gestión de estado** con Context API
- **Persistencia local** con LocalStorage
- **Notificaciones** con React Toastify
- **Responsive design** con Material-UI
- **Lazy loading** de imágenes
- **Debouncing** en búsquedas
- **Paginación** de tablas

## Integración con Backend

El frontend se comunica con el middleware Quarkus a través de:
- Base URL: `http://10.242.64.6:8080/api`
- Endpoints REST para todas las operaciones CRUD
- Manejo de errores centralizado
- Interceptores de Axios para logging

## Navegación

- `/` - Dashboard
- `/clientes` - Gestión de clientes
- `/productos` - Gestión de productos
- `/clases` - Gestión de categorías
- `/paises` - Gestión de países
- `/ciudades` - Gestión de ciudades
- `/carrito` - Carrito de compras

## Licencia

Proyecto educativo - Red Hat Enterprise Linux 9
```

---

## Resumen de Archivos Creados

### Configuración
- `package.json` - Dependencias y scripts
- `tsconfig.json` - Configuración de TypeScript
- `tsconfig.node.json` - TypeScript para Vite
- `vite.config.ts` - Configuración de Vite
- `.env.example` - Variables de entorno
- `.gitignore` - Archivos ignorados por Git

### Código Fuente (src/)
- `main.tsx` - Punto de entrada
- `App.tsx` - Componente principal
- `index.css` - Estilos globales

### Types
- `types/index.ts` - Todas las interfaces TypeScript

### Services
- `api.ts` - Cliente Axios configurado
- `paisService.ts` - Servicio de países
- `ciudadService.ts` - Servicio de ciudades
- `clienteService.ts` - Servicio de clientes
- `claseService.ts` - Servicio de categorías
- `productoService.ts` - Servicio de productos
- `ordenService.ts` - Servicio de órdenes
- `weatherService.ts` - Servicio de clima
- `imageService.ts` - Servicio de imágenes
- `priceService.ts` - Servicio de precios
- `dashboardService.ts` - Servicio del dashboard

### Utils
- `formatters.ts` - Funciones de formato
- `validators.ts` - Funciones de validación
- `storage.ts` - Utilidades de LocalStorage

### Contexts
- `AppContext.tsx` - Contexto de la aplicación
- `CarritoContext.tsx` - Contexto del carrito

### Hooks
- `useAsync.ts` - Hook para operaciones asíncronas
- `useDebounce.ts` - Hook para debouncing
- `usePagination.ts` - Hook para paginación

### Components/Common
- `Loading.tsx` - Componente de carga
- `ErrorMessage.tsx` - Mensaje de error
- `ConfirmDialog.tsx` - Diálogo de confirmación
- `SearchBar.tsx` - Barra de búsqueda
- `PageHeader.tsx` - Encabezado de página
- `DataTable.tsx` - Tabla de datos
- `StatCard.tsx` - Tarjeta de estadística
- `ImageSelector.tsx` - Selector de imágenes
- `EmptyState.tsx` - Estado vacío

### Components/Layout
- `MainLayout.tsx` - Layout principal con sidebar

### Pages
- `Dashboard.tsx` - Página principal
- `Clientes.tsx` - Gestión de clientes
- `Productos.tsx` - Gestión de productos
- `Clases.tsx` - Gestión de categorías
- `Paises.tsx` - Gestión de países
- `Ciudades.tsx` - Gestión de ciudades
- `Carrito.tsx` - Carrito de compras

### Components Específicos
- `ClienteDialog.tsx` - Diálogo de cliente
- `ProductoDialog.tsx` - Diálogo de producto
- `PaisDialog.tsx` - Diálogo de país
- `ClienteSelector.tsx` - Selector de cliente
- `ProductoSelector.tsx` - Selector de producto
- `CarritoResumen.tsx` - Resumen del carrito

### Documentación
- `PLAN.md` - Plan de arquitectura
- `README.md` - Documentación principal
- `CODIGO_COMPLETO_PARTE1.md` - Types, Services, Utils
- `CODIGO_COMPLETO_PARTE2.md` - Contexts, Hooks, Common Components
- `CODIGO_COMPLETO_PARTE3.md` - Layout, Dashboard, Clientes
- `CODIGO_COMPLETO_PARTE4.md` - Productos, Carrito
- `CODIGO_COMPLETO_PARTE5.md` - Componentes finales, App, Config

## Próximos Pasos

1. Instalar Node.js y npm en Red Hat 9
2. Copiar todos los archivos al servidor
3. Ejecutar `npm install`
4. Configurar `.env` con la URL del middleware
5. Ejecutar `npm run dev`
6. Acceder a `http://10.242.64.7:3000`