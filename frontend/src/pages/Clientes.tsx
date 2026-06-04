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