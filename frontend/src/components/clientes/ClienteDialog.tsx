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