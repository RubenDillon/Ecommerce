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