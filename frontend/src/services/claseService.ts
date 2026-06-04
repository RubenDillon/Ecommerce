// src/services/claseService.ts
import apiClient from './api';
import { Clase } from '@types/index';

export const claseService = {
  getAll: async (): Promise<Clase[]> => {
    const response = await apiClient.get<Clase[]>('/clases');
    return response.data;
  },

  getById: async (id: number): Promise<Clase> => {
    const response = await apiClient.get<Clase>(`/clases/${id}`);
    return response.data;
  },

  create: async (clase: Omit<Clase, 'idTipo'>): Promise<Clase> => {
    const response = await apiClient.post<Clase>('/clases', clase);
    return response.data;
  },

  update: async (id: number, clase: Omit<Clase, 'idTipo'>): Promise<Clase> => {
    const response = await apiClient.put<Clase>(`/clases/${id}`, clase);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/clases/${id}`);
  },
};