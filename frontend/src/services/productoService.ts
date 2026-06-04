// src/services/productoService.ts
import apiClient from './api';
import { Producto } from '@types/index';

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await apiClient.get<Producto[]>('/productos');
    return response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await apiClient.get<Producto>(`/productos/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Producto[]> => {
    const response = await apiClient.get<Producto[]>(`/productos/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getByClase: async (idTipo: number): Promise<Producto[]> => {
    const response = await apiClient.get<Producto[]>(`/productos/clase/${idTipo}`);
    return response.data;
  },

  getBySku: async (sku: number): Promise<Producto> => {
    const response = await apiClient.get<Producto>(`/productos/sku/${sku}`);
    return response.data;
  },

  getBajoStock: async (limite: number = 10): Promise<Producto[]> => {
    const response = await apiClient.get<Producto[]>(`/productos/bajo-stock?limite=${limite}`);
    return response.data;
  },

  create: async (producto: Omit<Producto, 'idProducto'>): Promise<Producto> => {
    const response = await apiClient.post<Producto>('/productos', producto);
    return response.data;
  },

  update: async (id: number, producto: Omit<Producto, 'idProducto'>): Promise<Producto> => {
    const response = await apiClient.put<Producto>(`/productos/${id}`, producto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/productos/${id}`);
  },

  updateStock: async (id: number, cantidad: number): Promise<Producto> => {
    const response = await apiClient.patch<Producto>(`/productos/${id}/stock`, { cantidad });
    return response.data;
  },
};