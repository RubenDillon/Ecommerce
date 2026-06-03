# Código Completo del Frontend - Parte 4: Productos, Carrito y Páginas Restantes

## 1. Productos Page (src/pages/Productos.tsx)

```typescript
// src/pages/Productos.tsx
import React, { useState, useEffect } from 'react';
import { Box, Chip, MenuItem, TextField } from '@mui/material';
import { productoService } from '@services/productoService';
import { claseService } from '@services/claseService';
import { Producto, Clase } from '@types/index';
import { DataTable, Column } from '@components/common/DataTable';
import { PageHeader } from '@components/common/PageHeader';
import { SearchBar } from '@components/common/SearchBar';
import { Loading } from '@components/common/Loading';
import { ErrorMessage } from '@components/common/ErrorMessage';
import { ConfirmDialog } from '@components/common/ConfirmDialog';
import { ProductoDialog } from '@components/productos/ProductoDialog';
import { formatCurrency } from '@utils/formatters';
import { toast } from 'react-toastify';

export const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [selectedClase, setSelectedClase] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterByClase();
  }, [selectedClase, productos]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productosData, clasesData] = await Promise.all([
        productoService.getAll(),
        claseService.getAll(),
      ]);
      
      setProductos(productosData);
      setFilteredProductos(productosData);
      setClases(clasesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const filterByClase = () => {
    if (!selectedClase) {
      setFilteredProductos(productos);
      return;
    }

    const filtered = productos.filter(
      (producto) => producto.idTipo === parseInt(selectedClase)
    );
    setFilteredProductos(filtered);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      filterByClase();
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const baseList = selectedClase
      ? productos.filter((p) => p.idTipo === parseInt(selectedClase))
      : productos;

    const filtered = baseList.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(lowercaseQuery) ||
        producto.sku.toString().includes(query)
    );
    setFilteredProductos(filtered);
  };

  const handleAdd = () => {
    setSelectedProducto(null);
    setDialogOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setDialogOpen(true);
  };

  const handleDelete = (producto: Producto) => {
    setProductoToDelete(producto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productoToDelete) return;

    try {
      await productoService.delete(productoToDelete.idProducto);
      toast.success('Producto eliminado exitosamente');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el producto');
    } finally {
      setDeleteDialogOpen(false);
      setProductoToDelete(null);
    }
  };

  const handleSave = async () => {
    setDialogOpen(false);
    await loadData();
    toast.success(selectedProducto ? 'Producto actualizado' : 'Producto creado');
  };

  const columns: Column<Producto>[] = [
    { id: 'idProducto', label: 'ID', minWidth: 70 },
    {
      id: 'foto',
      label: 'Imagen',
      minWidth: 100,
      format: (value) => (
        <img
          src={value}
          alt="Producto"
          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    { id: 'nombre', label: 'Nombre', minWidth: 200 },
    { id: 'sku', label: 'SKU', minWidth: 100 },
    {
      id: 'clase',
      label: 'Categoría',
      minWidth: 150,
      format: (_, row) => (
        <Chip label={row.clase?.nombre || '-'} size="small" color="primary" />
      ),
    },
    { id: 'stock', label: 'Stock', minWidth: 80, align: 'right' },
    {
      id: 'valorCosto',
      label: 'Costo',
      minWidth: 120,
      align: 'right',
      format: (value) => formatCurrency(value),
    },
    {
      id: 'valorVenta',
      label: 'Precio',
      minWidth: 120,
      align: 'right',
      format: (value) => formatCurrency(value),
    },
  ];

  if (loading) {
    return <Loading message="Cargando productos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <Box>
      <PageHeader
        title="Productos"
        subtitle={`${productos.length} productos en inventario`}
        onAdd={handleAdd}
        addButtonText="Nuevo Producto"
      />

      <Box mb={3} display="flex" gap={2}>
        <Box flex={1}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por nombre o SKU..."
          />
        </Box>
        <TextField
          select
          label="Filtrar por categoría"
          value={selectedClase}
          onChange={(e) => setSelectedClase(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {clases.map((clase) => (
            <MenuItem key={clase.idTipo} value={clase.idTipo}>
              {clase.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        data={filteredProductos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.idProducto}
      />

      <ProductoDialog
        open={dialogOpen}
        producto={selectedProducto}
        clases={clases}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Producto"
        message={`¿Está seguro que desea eliminar el producto "${productoToDelete?.nombre}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
      />
    </Box>
  );
};
```

## 2. Producto Dialog Component (src/components/productos/ProductoDialog.tsx)

```typescript
// src/components/productos/ProductoDialog.tsx
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
  Box,
  Avatar,
} from '@mui/material';
import { Producto, Clase } from '@types/index';
import { productoService } from '@services/productoService';
import { ImageSelector } from '@components/common/ImageSelector';
import { validateRequired, validatePrice, validateStock, validateSKU } from '@utils/validators';

interface ProductoDialogProps {
  open: boolean;
  producto: Producto | null;
  clases: Clase[];
  onClose: () => void;
  onSave: () => void;
}

export const ProductoDialog: React.FC<ProductoDialogProps> = ({
  open,
  producto,
  clases,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    sku: '',
    idTipo: '',
    stock: '',
    foto: '',
    valorCosto: '',
    valorVenta: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        sku: producto.sku.toString(),
        idTipo: producto.idTipo.toString(),
        stock: producto.stock.toString(),
        foto: producto.foto,
        valorCosto: producto.valorCosto.toString(),
        valorVenta: producto.valorVenta.toString(),
      });
    } else {
      setFormData({
        nombre: '',
        sku: '',
        idTipo: '',
        stock: '',
        foto: '',
        valorCosto: '',
        valorVenta: '',
      });
    }
    setErrors({});
  }, [producto, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    handleChange('foto', imageUrl);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.nombre)) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!validateRequired(formData.sku)) {
      newErrors.sku = 'El SKU es requerido';
    } else if (!validateSKU(parseInt(formData.sku))) {
      newErrors.sku = 'SKU inválido';
    }
    if (!validateRequired(formData.idTipo)) {
      newErrors.idTipo = 'La categoría es requerida';
    }
    if (!validateRequired(formData.stock)) {
      newErrors.stock = 'El stock es requerido';
    } else if (!validateStock(parseInt(formData.stock))) {
      newErrors.stock = 'Stock inválido';
    }
    if (!validateRequired(formData.foto)) {
      newErrors.foto = 'La imagen es requerida';
    }
    if (!validateRequired(formData.valorCosto)) {
      newErrors.valorCosto = 'El costo es requerido';
    } else if (!validatePrice(parseFloat(formData.valorCosto))) {
      newErrors.valorCosto = 'Costo inválido';
    }
    if (!validateRequired(formData.valorVenta)) {
      newErrors.valorVenta = 'El precio es requerido';
    } else if (!validatePrice(parseFloat(formData.valorVenta))) {
      newErrors.valorVenta = 'Precio inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const productoData = {
        nombre: formData.nombre,
        sku: parseInt(formData.sku),
        idTipo: parseInt(formData.idTipo),
        stock: parseInt(formData.stock),
        foto: formData.foto,
        valorCosto: parseFloat(formData.valorCosto),
        valorVenta: parseFloat(formData.valorVenta),
      };

      if (producto) {
        await productoService.update(producto.idProducto, productoData);
      } else {
        await productoService.create(productoData);
      }

      onSave();
    } catch (err: any) {
      setErrors({ submit: err.message || 'Error al guardar el producto' });
    } finally {
      setLoading(false);
    }
  };

  const selectedClase = clases.find((c) => c.idTipo === parseInt(formData.idTipo));

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                type="number"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                error={!!errors.sku}
                helperText={errors.sku}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Categoría"
                value={formData.idTipo}
                onChange={(e) => handleChange('idTipo', e.target.value)}
                error={!!errors.idTipo}
                helperText={errors.idTipo}
                required
              >
                {clases.map((clase) => (
                  <MenuItem key={clase.idTipo} value={clase.idTipo}>
                    {clase.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                error={!!errors.stock}
                helperText={errors.stock}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Costo"
                type="number"
                value={formData.valorCosto}
                onChange={(e) => handleChange('valorCosto', e.target.value)}
                error={!!errors.valorCosto}
                helperText={errors.valorCosto}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Precio de Venta"
                type="number"
                value={formData.valorVenta}
                onChange={(e) => handleChange('valorVenta', e.target.value)}
                error={!!errors.valorVenta}
                helperText={errors.valorVenta}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                {formData.foto && (
                  <Avatar
                    src={formData.foto}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                )}
                <Button
                  variant="outlined"
                  onClick={() => setImageSelectorOpen(true)}
                >
                  {formData.foto ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </Button>
              </Box>
              {errors.foto && (
                <Box color="error.main" fontSize="0.75rem" mt={1}>
                  {errors.foto}
                </Box>
              )}
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

      <ImageSelector
        open={imageSelectorOpen}
        onClose={() => setImageSelectorOpen(false)}
        onSelect={handleImageSelect}
        categoria={selectedClase?.nombre}
        productName={formData.nombre}
      />
    </>
  );
};
```

## 3. Carrito Page (src/pages/Carrito.tsx)

```typescript
// src/pages/Carrito.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCarrito } from '@contexts/CarritoContext';
import { useNavigate } from 'react-router-dom';
import { ClienteSelector } from '@components/carrito/ClienteSelector';
import { ProductoSelector } from '@components/carrito/ProductoSelector';
import { CarritoResumen } from '@components/carrito/CarritoResumen';
import { ordenService } from '@services/ordenService';
import { EmptyState } from '@components/common/EmptyState';
import { toast } from 'react-toastify';

const steps = ['Seleccionar Cliente', 'Agregar Productos', 'Confirmar Compra'];

export const Carrito: React.FC = () => {
  const navigate = useNavigate();
  const { items, clienteSeleccionado, limpiarCarrito } = useCarrito();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clienteSeleccionado && activeStep === 0) {
      setActiveStep(1);
    }
  }, [clienteSeleccionado]);

  const handleNext = () => {
    if (activeStep === 0 && !clienteSeleccionado) {
      toast.warning('Debe seleccionar un cliente');
      return;
    }
    if (activeStep === 1 && items.length === 0) {
      toast.warning('Debe agregar al menos un producto');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinalizarCompra = async () => {
    if (!clienteSeleccionado || items.length === 0) {
      toast.error('Faltan datos para completar la compra');
      return;
    }

    setLoading(true);
    try {
      const ordenData = {
        idCliente: clienteSeleccionado.idCliente,
        items: items.map((item) => ({
          idProducto: item.producto.idProducto,
          precioVenta: item.precioUnitario,
        })),
      };

      await ordenService.create(ordenData);
      toast.success('¡Compra realizada exitosamente!');
      limpiarCarrito();
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  if (activeStep === 2 && items.length === 0) {
    return (
      <Box>
        <EmptyState
          title="Carrito Vacío"
          message="No hay productos en el carrito"
          icon={<ShoppingCartIcon sx={{ fontSize: 64 }} />}
          actionLabel="Ir al Dashboard"
          onAction={() => navigate('/')}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      <Box mb={4}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {activeStep === 0 && <ClienteSelector />}
              {activeStep === 1 && <ProductoSelector />}
              {activeStep === 2 && <CarritoResumen />}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {clienteSeleccionado && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cliente:
                  </Typography>
                  <Typography variant="body1">
                    {clienteSeleccionado.nombre}
                  </Typography>
                </Box>
              )}

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Productos:
                </Typography>
                <Typography variant="body1">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" flexDirection="column" gap={1}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Atrás
                  </Button>
                )}
                
                {activeStep < 2 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && !clienteSeleccionado) ||
                      (activeStep === 1 && items.length === 0)
                    }
                  >
                    Siguiente
                  </Button>
                )}

                {activeStep === 2 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleFinalizarCompra}
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Finalizar Compra'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
```

## 4. Cliente Selector Component (src/components/carrito/ClienteSelector.tsx)

```typescript
// src/components/carrito/ClienteSelector.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { clienteService } from '@services/clienteService';
import { Cliente } from '@types/index';
import { useCarrito } from '@contexts/CarritoContext';
import { useDebounce } from '@hooks/useDebounce';
import { Loading } from '@components/common/Loading';

export const ClienteSelector: React.FC = () => {
  const { clienteSeleccionado, setClienteSeleccionado } = useCarrito();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch) {
      searchClientes();
    } else {
      loadClientes();
    }
  }, [debouncedSearch]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error loading clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.search(debouncedSearch);
      setClientes(data);
    } catch (error) {
      console.error('Error searching clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccionar Cliente
      </Typography>

      <TextField
        fullWidth
        placeholder="Buscar cliente por nombre o email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading ? (
        <Loading message="Buscando clientes..." />
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {clientes.map((cliente) => (
            <React.Fragment key={cliente.idCliente}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={clienteSeleccionado?.idCliente === cliente.idCliente}
                  onClick={() => handleSelectCliente(cliente)}
                >
                  <ListItemText
                    primary={cliente.nombre}
                    secondary={`${cliente.correoElectronico} - ${cliente.telefono}`}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      {clientes.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary" gutterBottom>
            No se encontraron clientes
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => {/* Implementar creación rápida */}}
          >
            Crear Nuevo Cliente
          </Button>
        </Box>
      )}
    </Box>
  );
};
```

## 5. Producto Selector Component (src/components/carrito/ProductoSelector.tsx)

```typescript
// src/components/carrito/ProductoSelector.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Chip,
  MenuItem,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { productoService } from '@services/productoService';
import { claseService } from '@services/claseService';
import { priceService } from '@services/priceService';
import { Producto, Clase, PrecioReferencia } from '@types/index';
import { useCarrito } from '@contexts/CarritoContext';
import { formatCurrency } from '@utils/formatters';
import { Loading } from '@components/common/Loading';
import { toast } from 'react-toastify';

export const ProductoSelector: React.FC = () => {
  const { agregarItem } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [preciosReferencia, setPreciosReferencia] = useState<Map<number, PrecioReferencia>>(new Map());
  const [loading, setLoading] = useState(false);
  const [selectedClase, setSelectedClase] = useState<string>('');
  const [cantidades, setCantidades] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClase) {
      loadProductosByClase();
    } else {
      loadProductos();
    }
  }, [selectedClase]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productosData, clasesData] = await Promise.all([
        productoService.getAll(),
        claseService.getAll(),
      ]);
      setProductos(productosData);
      setClases(clasesData);
      
      // Cargar precios de referencia
      const precios = await priceService.getPreciosReferencia(productosData);
      setPreciosReferencia(precios);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductos = async () => {
    setLoading(true);
    try {
      const data = await productoService.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error loading productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductosByClase = async () => {
    setLoading(true);
    try {
      const data = await productoService.getByClase(parseInt(selectedClase));
      setProductos(data);
    } catch (error) {
      console.error('Error loading productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadChange = (idProducto: number, cantidad: number) => {
    const newCantidades = new Map(cantidades);
    newCantidades.set(idProducto, cantidad);
    setCantidades(newCantidades);
  };

  const handleAgregarAlCarrito = (producto: Producto) => {
    const cantidad = cantidades.get(producto.idProducto) || 1;
    
    if (cantidad > producto.stock) {
      toast.error('Cantidad supera el stock disponible');
      return;
    }

    agregarItem(producto, cantidad);
    toast.success(`${producto.nombre} agregado al carrito`);
    
    // Resetear cantidad
    const newCantidades = new Map(cantidades);
    newCantidades.set(producto.idProducto, 1);
    setCantidades(newCantidades);
  };

  if (loading) {
    return <Loading message="Cargando productos..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Seleccionar Productos
        </Typography>
        <TextField
          select
          label="Filtrar por categoría"
          value={selectedClase}
          onChange={(e) => setSelectedClase(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        >
          <MenuItem value="">Todas</MenuItem>
          {clases.map((clase) => (
            <MenuItem key={clase.idTipo} value={clase.idTipo}>
              {clase.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={2}>
        {productos.map((producto) => {
          const precioRef = preciosReferencia.get(producto.idProducto);
          const comparacion = precioRef
            ? priceService.compararPrecio(producto.valorVenta, precioRef.precioEstimado)
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={producto.idProducto}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.foto}
                  alt={producto.nombre}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {producto.nombre}
                  </Typography>
                  <Chip
                    label={producto.clase?.nombre}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Stock: {producto.stock}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                    {formatCurrency(producto.valorVenta)}
                  </Typography>
                  {precioRef && comparacion && (
                    <Typography
                      variant="body2"
                      color={comparacion.esMejor ? 'success.main' : 'error.main'}
                    >
                      Ref. mercado: {formatCurrency(precioRef.precioEstimado)}
                      {comparacion.esMejor ? ' ✓' : ' ✗'}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <TextField
                    type="number"
                    size="small"
                    value={cantidades.get(producto.idProducto) || 1}
                    onChange={(e) =>
                      handleCantidadChange(producto.idProducto, parseInt(e.target.value) || 1)
                    }
                    inputProps={{ min: 1, max: producto.stock }}
                    sx={{ width: 80 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAgregarAlCarrito(producto)}
                    disabled={producto.stock === 0}
                    fullWidth
                  >
                    Agregar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
```

---

**Continúa en CODIGO_COMPLETO_PARTE5.md con componentes finales, App.tsx y archivos de configuración**