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