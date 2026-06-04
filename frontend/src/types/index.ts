// src/types/index.ts

export interface Pais {
  idPais: number;
  nombre: string;
}

export interface Ciudad {
  idCiudad: number;
  idPais: number;
  ciudad: string;
  pais?: Pais;
}

export interface Cliente {
  idCliente: number;
  nombre: string;
  direccion: string;
  idCiudad: number;
  idPais: number;
  telefono: string;
  correoElectronico: string;
  ciudad?: Ciudad;
  pais?: Pais;
}

export interface Clase {
  idTipo: number;
  nombre: string;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  sku: number;
  idTipo: number;
  stock: number;
  foto: string;
  valorCosto: number;
  valorVenta: number;
  clase?: Clase;
}

export interface Orden {
  idOrden: number;
  idCliente: number;
  fecha: string;
  cliente?: Cliente;
  items?: OrdenItem[];
}

export interface OrdenItem {
  idOrden: number;
  idProducto: number;
  precioVenta: number;
  producto?: Producto;
}

export interface CreateOrdenRequest {
  idCliente: number;
  items: {
    idProducto: number;
    precioVenta: number;
  }[];
}

export interface DashboardMetrics {
  totalClientes: number;
  totalProductos: number;
  valoracionStock: number;
  productosCategoria: {
    categoria: string;
    cantidad: number;
  }[];
}

export interface WeatherData {
  temperatura: number;
  condicion: string;
  icono: string;
}

export interface PrecioReferencia {
  idProducto: number;
  precioEstimado: number;
  fuente: string;
}

export interface ImageSuggestion {
  url: string;
  thumbnail: string;
  description: string;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}