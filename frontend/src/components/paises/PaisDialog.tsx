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