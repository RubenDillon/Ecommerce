// src/pages/Paises.tsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { paisService } from '@services/paisService';
import { Pais } from '@types/index';
import { DataTable, Column } from '@components/common/DataTable';
import { PageHeader } from '@components/common/PageHeader';
import { Loading } from '@components/common/Loading';
import { ErrorMessage } from '@components/common/ErrorMessage';
import { ConfirmDialog } from '@components/common/ConfirmDialog';
import { PaisDialog } from '@components/paises/PaisDialog';
import { toast } from 'react-toastify';

export const Paises: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPais, setSelectedPais] = useState<Pais | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paisToDelete, setPaisToDelete] = useState<Pais | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paisService.getAll();
      setPaises(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los países');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPais(null);
    setDialogOpen(true);
  };

  const handleEdit = (pais: Pais) => {
    setSelectedPais(pais);
    setDialogOpen(true);
  };

  const handleDelete = (pais: Pais) => {
    setPaisToDelete(pais);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!paisToDelete) return;
    try {
      await paisService.delete(paisToDelete.idPais);
      toast.success('País eliminado exitosamente');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el país');
    } finally {
      setDeleteDialogOpen(false);
      setPaisToDelete(null);
    }
  };

  const handleSave = async () => {
    setDialogOpen(false);
    await loadData();
    toast.success(selectedPais ? 'País actualizado' : 'País creado');
  };

  const columns: Column<Pais>[] = [
    { id: 'idPais', label: 'ID', minWidth: 70 },
    { id: 'nombre', label: 'Nombre', minWidth: 200 },
  ];

  if (loading) return <Loading message="Cargando países..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <Box>
      <PageHeader
        title="Países"
        subtitle={`${paises.length} países registrados`}
        onAdd={handleAdd}
        addButtonText="Nuevo País"
      />
      <DataTable
        columns={columns}
        data={paises}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.idPais}
      />
      <PaisDialog
        open={dialogOpen}
        pais={selectedPais}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar País"
        message={`¿Está seguro que desea eliminar el país "${paisToDelete?.nombre}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
      />
    </Box>
  );
};