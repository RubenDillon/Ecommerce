// src/services/paisService.ts
import apiClient from './api';
import { Pais } from '@types/index';

export const paisService = {
  getAll: async (): Promise<Pais[]> => {
    const response = await apiClient.get<Pais[]>('/paises');
    return response.data;
  },

  getById: async (id: number): Promise<Pais> => {
    const response = await apiClient.get<Pais>(`/paises/${id}`);
    return response.data;
  },

  create: async (pais: Omit<Pais, 'idPais'>): Promise<Pais> => {
    const response = await apiClient.post<Pais>('/paises', pais);
    return response.data;
  },

  update: async (id: number, pais: Omit<Pais, 'idPais'>): Promise<Pais> => {
    const response = await apiClient.put<Pais>(`/paises/${id}`, pais);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/paises/${id}`);
  },
};