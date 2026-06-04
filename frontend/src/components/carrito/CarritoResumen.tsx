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