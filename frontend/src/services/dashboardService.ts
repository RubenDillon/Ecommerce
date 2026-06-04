// src/services/dashboardService.ts
import { clienteService } from './clienteService';
import { productoService } from './productoService';
import { claseService } from './claseService';
import { DashboardMetrics } from '@types/index';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const [clientes, productos, clases] = await Promise.all([
        clienteService.getAll(),
        productoService.getAll(),
        claseService.getAll(),
      ]);

      // Calcular valoración del stock
      const valoracionStock = productos.reduce(
        (total, producto) => total + (producto.stock * producto.valorCosto),
        0
      );

      // Agrupar productos por categoría
      const productosCategoria = clases.map(clase => {
        const cantidad = productos.filter(p => p.idTipo === clase.idTipo).length;
        return {
          categoria: clase.nombre,
          cantidad,
        };
      }).filter(item => item.cantidad > 0);

      return {
        totalClientes: clientes.length,
        totalProductos: productos.length,
        valoracionStock,
        productosCategoria,
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },
};