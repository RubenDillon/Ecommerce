// src/services/clienteService.ts
import apiClient from './api';
import { Cliente } from '@types/index';

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await apiClient.get<Cliente[]>('/clientes');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await apiClient.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Cliente[]> => {
    const response = await apiClient.get<Cliente[]>(`/clientes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getByPais: async (idPais: number): Promise<Cliente[]> => {
    const response = await apiClient.get<Cliente[]>(`/clientes/pais/${idPais}`);
    return response.data;
  },

  getByCiudad: async (idCiudad: number): Promise<Cliente[]> => {
    const response = await apiClient.get<Cliente[]>(`/clientes/ciudad/${idCiudad}`);
    return response.data;
  },

  create: async (cliente: Omit<Cliente, 'idCliente'>): Promise<Cliente> => {
    const response = await apiClient.post<Cliente>('/clientes', cliente);
    return response.data;
  },

  update: async (id: number, cliente: Omit<Cliente, 'idCliente'>): Promise<Cliente> => {
    const response = await apiClient.put<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/clientes/${id}`);
  },
};