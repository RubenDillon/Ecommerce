# Código Completo del Frontend - Parte 3: Layout y Páginas Principales

## 1. Main Layout (src/components/layout/MainLayout.tsx)

```typescript
// src/components/layout/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CategoryIcon from '@mui/icons-material/Category';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useApp } from '@contexts/AppContext';
import { useCarrito } from '@contexts/CarritoContext';

const DRAWER_WIDTH = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
  { text: 'Productos', icon: <InventoryIcon />, path: '/productos' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/clases' },
  { text: 'Países', icon: <PublicIcon />, path: '/paises' },
  { text: 'Ciudades', icon: <LocationCityIcon />, path: '/ciudades' },
  { text: 'Carrito', icon: <ShoppingCartIcon />, path: '/carrito' },
];

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { theme: appTheme, toggleTheme } = useApp();
  const { getCantidadItems } = useCarrito();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          E-Commerce
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>
                {item.text === 'Carrito' ? (
                  <Badge badgeContent={getCantidadItems()} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Compras
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {appTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
```

## 2. Dashboard Page (src/pages/Dashboard.tsx)

```typescript
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardService } from '@services/dashboardService';
import { weatherService } from '@services/weatherService';
import { DashboardMetrics, WeatherData } from '@types/index';
import { formatCurrency, formatNumber, formatTime } from '@utils/formatters';
import { Loading } from '@components/common/Loading';
import { ErrorMessage } from '@components/common/ErrorMessage';
import { StatCard } from '@components/common/StatCard';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B9D', '#C084FC', '#34D399',
];

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    
    // Actualizar hora cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [metricsData, weatherData] = await Promise.all([
        dashboardService.getMetrics(),
        weatherService.getWeather(),
      ]);
      
      setMetrics(metricsData);
      setWeather(weatherData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  if (!metrics) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Métricas principales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clientes"
            value={formatNumber(metrics.totalClientes)}
            icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
            color="primary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Productos"
            value={formatNumber(metrics.totalProductos)}
            icon={<InventoryIcon sx={{ fontSize: 40, color: 'success.main' }} />}
            color="success.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valoración Stock"
            value={formatCurrency(metrics.valoracionStock)}
            icon={<AttachMoneyIcon sx={{ fontSize: 40, color: 'warning.main' }} />}
            color="warning.main"
            subtitle="Valor total del inventario"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Hora Actual
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatTime(currentTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Argentina (UTC-3)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'info.light',
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clima */}
        {weather && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Clima en Argentina
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h2" component="span">
                    {weather.icono}
                  </Typography>
                  <Box>
                    <Typography variant="h3" component="div">
                      {weather.temperatura}°C
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {weather.condicion}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Gráfico de productos por categoría */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productos por Categoría
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.productosCategoria}
                    dataKey="cantidad"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {metrics.productosCategoria.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen de categorías */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Categorías
              </Typography>
              <Grid container spacing={2}>
                {metrics.productosCategoria.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.categoria}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: 'background.default',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <Typography variant="body2">{item.categoria}</Typography>
                      </Box>
                      <Typography variant="h6">{item.cantidad}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
```

## 3. Clientes Page (src/pages/Clientes.tsx)

```typescript
// src/pages/Clientes.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Chip } from '@mui/material';
import { clienteService } from '@services/clienteService';
import { paisService } from '@services/paisService';
import { ciudadService } from '@services/ciudadService';
import { Cliente, Pais, Ciudad } from '@types/index';
import { DataTable, Column } from '@components/common/DataTable';
import { PageHeader } from '@components/common/PageHeader';
import { SearchBar } from '@components/common/SearchBar';
import { Loading } from '@components/common/Loading';
import { ErrorMessage } from '@components/common/ErrorMessage';
import { ConfirmDialog } from '@components/common/ConfirmDialog';
import { ClienteDialog } from '@components/clientes/ClienteDialog';
import { toast } from 'react-toastify';

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clientesData, paisesData, ciudadesData] = await Promise.all([
        clienteService.getAll(),
        paisService.getAll(),
        ciudadService.getAll(),
      ]);
      
      setClientes(clientesData);
      setFilteredClientes(clientesData);
      setPaises(paisesData);
      setCiudades(ciudadesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredClientes(clientes);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(lowercaseQuery) ||
        cliente.correoElectronico.toLowerCase().includes(lowercaseQuery) ||
        cliente.telefono.includes(query)
    );
    setFilteredClientes(filtered);
  };

  const handleAdd = () => {
    setSelectedCliente(null);
    setDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDialogOpen(true);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await clienteService.delete(clienteToDelete.idCliente);
      toast.success('Cliente eliminado exitosamente');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el cliente');
    } finally {
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
    }
  };

  const handleSave = async () => {
    setDialogOpen(false);
    await loadData();
    toast.success(selectedCliente ? 'Cliente actualizado' : 'Cliente creado');
  };

  const columns: Column<Cliente>[] = [
    { id: 'idCliente', label: 'ID', minWidth: 70 },
    { id: 'nombre', label: 'Nombre', minWidth: 150 },
    { id: 'correoElectronico', label: 'Email', minWidth: 200 },
    { id: 'telefono', label: 'Teléfono', minWidth: 130 },
    {
      id: 'pais',
      label: 'País',
      minWidth: 120,
      format: (_, row) => row.pais?.nombre || '-',
    },
    {
      id: 'ciudad',
      label: 'Ciudad',
      minWidth: 120,
      format: (_, row) => row.ciudad?.ciudad || '-',
    },
  ];

  if (loading) {
    return <Loading message="Cargando clientes..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <Box>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} clientes registrados`}
        onAdd={handleAdd}
        addButtonText="Nuevo Cliente"
      />

      <Box mb={3}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar por nombre, email o teléfono..."
        />
      </Box>

      <DataTable
        columns={columns}
        data={filteredClientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.idCliente}
      />

      <ClienteDialog
        open={dialogOpen}
        cliente={selectedCliente}
        paises={paises}
        ciudades={ciudades}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Cliente"
        message={`¿Está seguro que desea eliminar al cliente "${clienteToDelete?.nombre}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
      />
    </Box>
  );
};
```

## 4. Cliente Dialog Component (src/components/clientes/ClienteDialog.tsx)

```typescript
// src/components/clientes/ClienteDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { Cliente, Pais, Ciudad } from '@types/index';
import { clienteService } from '@services/clienteService';
import { ciudadService } from '@services/ciudadService';
import { validateEmail, validatePhone, validateRequired } from '@utils/validators';

interface ClienteDialogProps {
  open: boolean;
  cliente: Cliente | null;
  paises: Pais[];
  ciudades: Ciudad[];
  onClose: () => void;
  onSave: () => void;
}

export const ClienteDialog: React.FC<ClienteDialogProps> = ({
  open,
  cliente,
  paises,
  ciudades,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    idPais: '',
    idCiudad: '',
    telefono: '',
    correoElectronico: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        idPais: cliente.idPais.toString(),
        idCiudad: cliente.idCiudad.toString(),
        telefono: cliente.telefono,
        correoElectronico: cliente.correoElectronico,
      });
    } else {
      setFormData({
        nombre: '',
        direccion: '',
        idPais: '',
        idCiudad: '',
        telefono: '',
        correoElectronico: '',
      });
    }
    setErrors({});
  }, [cliente, open]);

  useEffect(() => {
    if (formData.idPais) {
      const filtered = ciudades.filter(
        (c) => c.idPais === parseInt(formData.idPais)
      );
      setCiudadesFiltradas(filtered);
      
      // Si la ciudad seleccionada no pertenece al país, limpiarla
      if (formData.idCiudad) {
        const ciudadValida = filtered.find(
          (c) => c.idCiudad === parseInt(formData.idCiudad)
        );
        if (!ciudadValida) {
          setFormData((prev) => ({ ...prev, idCiudad: '' }));
        }
      }
    } else {
      setCiudadesFiltradas([]);
    }
  }, [formData.idPais, ciudades]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.nombre)) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!validateRequired(formData.direccion)) {
      newErrors.direccion = 'La dirección es requerida';
    }
    if (!validateRequired(formData.idPais)) {
      newErrors.idPais = 'El país es requerido';
    }
    if (!validateRequired(formData.idCiudad)) {
      newErrors.idCiudad = 'La ciudad es requerida';
    }
    if (!validateRequired(formData.telefono)) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!validatePhone(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }
    if (!validateRequired(formData.correoElectronico)) {
      newErrors.correoElectronico = 'El email es requerido';
    } else if (!validateEmail(formData.correoElectronico)) {
      newErrors.correoElectronico = 'Formato de email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const clienteData = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        idPais: parseInt(formData.idPais),
        idCiudad: parseInt(formData.idCiudad),
        telefono: formData.telefono,
        correoElectronico: formData.correoElectronico,
      };

      if (cliente) {
        await clienteService.update(cliente.idCliente, clienteData);
      } else {
        await clienteService.create(clienteData);
      }

      onSave();
    } catch (err: any) {
      setErrors({ submit: err.message || 'Error al guardar el cliente' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              error={!!errors.direccion}
              helperText={errors.direccion}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="País"
              value={formData.idPais}
              onChange={(e) => handleChange('idPais', e.target.value)}
              error={!!errors.idPais}
              helperText={errors.idPais}
              required
            >
              {paises.map((pais) => (
                <MenuItem key={pais.idPais} value={pais.idPais}>
                  {pais.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Ciudad"
              value={formData.idCiudad}
              onChange={(e) => handleChange('idCiudad', e.target.value)}
              error={!!errors.idCiudad}
              helperText={errors.idCiudad}
              disabled={!formData.idPais}
              required
            >
              {ciudadesFiltradas.map((ciudad) => (
                <MenuItem key={ciudad.idCiudad} value={ciudad.idCiudad}>
                  {ciudad.ciudad}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              error={!!errors.telefono}
              helperText={errors.telefono}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.correoElectronico}
              onChange={(e) => handleChange('correoElectronico', e.target.value)}
              error={!!errors.correoElectronico}
              helperText={errors.correoElectronico}
              required
            />
          </Grid>
        </Grid>
        {errors.submit && (
          <Box mt={2}>
            <ErrorMessage message={errors.submit} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

---

**Continúa en CODIGO_COMPLETO_PARTE4.md con Productos, Carrito y páginas restantes**