// src/services/ciudadService.ts
import apiClient from './api';
import { Ciudad } from '@types/index';

export const ciudadService = {
  getAll: async (): Promise<Ciudad[]> => {
    const response = await apiClient.get<Ciudad[]>('/ciudades');
    return response.data;
  },

  getById: async (id: number): Promise<Ciudad> => {
    const response = await apiClient.get<Ciudad>(`/ciudades/${id}`);
    return response.data;
  },

  getByPais: async (idPais: number): Promise<Ciudad[]> => {
    const response = await apiClient.get<Ciudad[]>(`/ciudades/pais/${idPais}`);
    return response.data;
  },

  create: async (ciudad: Omit<Ciudad, 'idCiudad'>): Promise<Ciudad> => {
    const response = await apiClient.post<Ciudad>('/ciudades', ciudad);
    return response.data;
  },

  update: async (id: number, ciudad: Omit<Ciudad, 'idCiudad'>): Promise<Ciudad> => {
    const response = await apiClient.put<Ciudad>(`/ciudades/${id}`, ciudad);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ciudades/${id}`);
  },
};