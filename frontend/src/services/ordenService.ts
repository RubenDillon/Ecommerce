// src/services/ordenService.ts
import apiClient from './api';
import { Orden, CreateOrdenRequest } from '@types/index';

export const ordenService = {
  getAll: async (): Promise<Orden[]> => {
    const response = await apiClient.get<Orden[]>('/ordenes');
    return response.data;
  },

  getById: async (id: number): Promise<Orden> => {
    const response = await apiClient.get<Orden>(`/ordenes/${id}`);
    return response.data;
  },

  getByCliente: async (idCliente: number): Promise<Orden[]> => {
    const response = await apiClient.get<Orden[]>(`/ordenes/cliente/${idCliente}`);
    return response.data;
  },

  getByFecha: async (fecha: string): Promise<Orden[]> => {
    const response = await apiClient.get<Orden[]>(`/ordenes/fecha/${fecha}`);
    return response.data;
  },

  create: async (orden: CreateOrdenRequest): Promise<Orden> => {
    const response = await apiClient.post<Orden>('/ordenes', orden);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ordenes/${id}`);
  },

  getTotal: async (id: number): Promise<number> => {
    const response = await apiClient.get<{ total: number }>(`/ordenes/${id}/total`);
    return response.data.total;
  },
};