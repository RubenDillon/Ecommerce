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