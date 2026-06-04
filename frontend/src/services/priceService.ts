// src/services/priceService.ts
import { PrecioReferencia, Producto } from '@types/index';

// Servicio para obtener precios de referencia del mercado
// En un entorno real, esto podría hacer web scraping o usar APIs de e-commerce
export const priceService = {
  getPrecioReferencia: async (producto: Producto): Promise<PrecioReferencia> => {
    // Simulamos una búsqueda de precio de referencia
    // En producción, esto podría consultar APIs de MercadoLibre, Amazon, etc.
    
    // Por ahora, estimamos basándonos en el precio de venta + variación
    const variacion = Math.random() * 0.3 - 0.15; // -15% a +15%
    const precioEstimado = Math.round(producto.valorVenta * (1 + variacion));
    
    return {
      idProducto: producto.idProducto,
      precioEstimado,
      fuente: 'Estimación de mercado',
    };
  },

  getPreciosReferencia: async (productos: Producto[]): Promise<Map<number, PrecioReferencia>> => {
    const precios = new Map<number, PrecioReferencia>();
    
    for (const producto of productos) {
      const precio = await priceService.getPrecioReferencia(producto);
      precios.set(producto.idProducto, precio);
    }
    
    return precios;
  },

  compararPrecio: (precioVenta: number, precioReferencia: number): {
    diferencia: number;
    porcentaje: number;
    esMejor: boolean;
  } => {
    const diferencia = precioVenta - precioReferencia;
    const porcentaje = ((diferencia / precioReferencia) * 100);
    const esMejor = diferencia < 0;
    
    return {
      diferencia: Math.abs(diferencia),
      porcentaje: Math.abs(porcentaje),
      esMejor,
    };
  },
};