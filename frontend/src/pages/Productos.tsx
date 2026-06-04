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