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