# Código Completo del Frontend - Parte 1: Types, Services y Utils

## 1. Types (src/types/index.ts)

```typescript
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
```

## 2. API Client Configuration (src/services/api.ts)

```typescript
// src/services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.242.64.6:8080/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('[API Response Error]', error.response?.status, error.message);
    
    if (error.response) {
      // Server responded with error
      const apiError = {
        message: error.response.data?.message || 'Error en la solicitud',
        status: error.response.status,
        details: error.response.data?.details || error.message,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
        details: 'Verifique que el middleware esté ejecutándose en 10.242.64.6:8080',
      });
    } else {
      // Error setting up request
      return Promise.reject({
        message: 'Error al configurar la solicitud',
        details: error.message,
      });
    }
  }
);

export default apiClient;
```

## 3. Pais Service (src/services/paisService.ts)

```typescript
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
```

## 4. Ciudad Service (src/services/ciudadService.ts)

```typescript
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
```

## 5. Cliente Service (src/services/clienteService.ts)

```typescript
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
```

## 6. Clase Service (src/services/claseService.ts)

```typescript
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
```

## 7. Producto Service (src/services/productoService.ts)

```typescript
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
```

## 8. Orden Service (src/services/ordenService.ts)

```typescript
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
```

## 9. Weather Service (src/services/weatherService.ts)

```typescript
// src/services/weatherService.ts
import axios from 'axios';
import { WeatherData } from '@types/index';

// Usando wttr.in - servicio gratuito sin API key
const WEATHER_API_URL = 'https://wttr.in/Buenos_Aires?format=j1';

export const weatherService = {
  getWeather: async (): Promise<WeatherData> => {
    try {
      const response = await axios.get(WEATHER_API_URL);
      const data = response.data;
      
      const current = data.current_condition[0];
      
      return {
        temperatura: parseInt(current.temp_C),
        condicion: current.weatherDesc[0].value,
        icono: getWeatherIcon(current.weatherCode),
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Retornar datos por defecto en caso de error
      return {
        temperatura: 20,
        condicion: 'Parcialmente nublado',
        icono: '⛅',
      };
    }
  },
};

function getWeatherIcon(code: string): string {
  const weatherIcons: Record<string, string> = {
    '113': '☀️', // Sunny
    '116': '⛅', // Partly cloudy
    '119': '☁️', // Cloudy
    '122': '☁️', // Overcast
    '143': '🌫️', // Mist
    '176': '🌦️', // Patchy rain possible
    '179': '🌨️', // Patchy snow possible
    '182': '🌧️', // Patchy sleet possible
    '185': '🌧️', // Patchy freezing drizzle possible
    '200': '⛈️', // Thundery outbreaks possible
    '227': '🌨️', // Blowing snow
    '230': '❄️', // Blizzard
    '248': '🌫️', // Fog
    '260': '🌫️', // Freezing fog
    '263': '🌦️', // Patchy light drizzle
    '266': '🌧️', // Light drizzle
    '281': '🌧️', // Freezing drizzle
    '284': '🌧️', // Heavy freezing drizzle
    '293': '🌦️', // Patchy light rain
    '296': '🌧️', // Light rain
    '299': '🌧️', // Moderate rain at times
    '302': '🌧️', // Moderate rain
    '305': '🌧️', // Heavy rain at times
    '308': '🌧️', // Heavy rain
    '311': '🌧️', // Light freezing rain
    '314': '🌧️', // Moderate or heavy freezing rain
    '317': '🌨️', // Light sleet
    '320': '🌨️', // Moderate or heavy sleet
    '323': '🌨️', // Patchy light snow
    '326': '❄️', // Light snow
    '329': '❄️', // Patchy moderate snow
    '332': '❄️', // Moderate snow
    '335': '❄️', // Patchy heavy snow
    '338': '❄️', // Heavy snow
    '350': '🌧️', // Ice pellets
    '353': '🌦️', // Light rain shower
    '356': '🌧️', // Moderate or heavy rain shower
    '359': '🌧️', // Torrential rain shower
    '362': '🌨️', // Light sleet showers
    '365': '🌨️', // Moderate or heavy sleet showers
    '368': '🌨️', // Light snow showers
    '371': '❄️', // Moderate or heavy snow showers
    '374': '🌧️', // Light showers of ice pellets
    '377': '🌧️', // Moderate or heavy showers of ice pellets
    '386': '⛈️', // Patchy light rain with thunder
    '389': '⛈️', // Moderate or heavy rain with thunder
    '392': '⛈️', // Patchy light snow with thunder
    '395': '⛈️', // Moderate or heavy snow with thunder
  };
  
  return weatherIcons[code] || '🌤️';
}
```

## 10. Image Service (src/services/imageService.ts)

```typescript
// src/services/imageService.ts
import axios from 'axios';
import { ImageSuggestion } from '@types/index';

// Usando Unsplash Source API (gratuito, sin API key)
const UNSPLASH_SOURCE_URL = 'https://source.unsplash.com';

// Mapeo de categorías a términos de búsqueda en inglés
const categorySearchTerms: Record<string, string[]> = {
  'Bienes electrónicos': ['electronics', 'gadgets', 'technology', 'smartphone', 'laptop'],
  'Indumentaria': ['clothing', 'fashion', 'apparel', 'shoes', 'sneakers'],
  'Electrodomésticos': ['appliances', 'kitchen', 'home-appliances', 'refrigerator', 'washing-machine'],
  'Productos de belleza': ['beauty', 'cosmetics', 'makeup', 'skincare', 'perfume'],
  'Deportes': ['sports', 'fitness', 'exercise', 'gym', 'athletic'],
  'Juguetes': ['toys', 'games', 'kids', 'children', 'play'],
  'Libros': ['books', 'reading', 'literature', 'library', 'novel'],
  'Muebles': ['furniture', 'home', 'interior', 'chair', 'table'],
  'Herramientas': ['tools', 'hardware', 'construction', 'workshop', 'equipment'],
  'Alimentos': ['food', 'grocery', 'cooking', 'ingredients', 'kitchen'],
  'Bebidas': ['drinks', 'beverages', 'coffee', 'tea', 'juice'],
  'Mascotas': ['pets', 'animals', 'dog', 'cat', 'pet-supplies'],
  'Jardinería': ['garden', 'plants', 'flowers', 'gardening', 'outdoor'],
  'Automotriz': ['automotive', 'car', 'vehicle', 'auto-parts', 'motorcycle'],
  'Música': ['music', 'instruments', 'guitar', 'piano', 'audio'],
  'Fotografía': ['photography', 'camera', 'photo', 'lens', 'digital'],
  'Oficina': ['office', 'stationery', 'desk', 'supplies', 'workspace'],
  'Bebés': ['baby', 'infant', 'newborn', 'nursery', 'children'],
  'Salud': ['health', 'medical', 'wellness', 'healthcare', 'medicine'],
  'Joyería': ['jewelry', 'accessories', 'watch', 'necklace', 'ring'],
};

export const imageService = {
  getSuggestions: async (categoria: string, productName?: string): Promise<ImageSuggestion[]> => {
    const searchTerms = categorySearchTerms[categoria] || ['product'];
    const suggestions: ImageSuggestion[] = [];

    // Generar 10 sugerencias usando diferentes términos
    for (let i = 0; i < 10; i++) {
      const term = searchTerms[i % searchTerms.length];
      const randomSeed = Date.now() + i;
      
      suggestions.push({
        url: `${UNSPLASH_SOURCE_URL}/800x600/?${term}&sig=${randomSeed}`,
        thumbnail: `${UNSPLASH_SOURCE_URL}/200x150/?${term}&sig=${randomSeed}`,
        description: `${categoria} - ${term}`,
      });
    }

    return suggestions;
  },

  getImageUrl: (categoria: string, seed?: number): string => {
    const searchTerms = categorySearchTerms[categoria] || ['product'];
    const term = searchTerms[0];
    const randomSeed = seed || Date.now();
    return `${UNSPLASH_SOURCE_URL}/800x600/?${term}&sig=${randomSeed}`;
  },

  uploadImage: async (file: File): Promise<string> => {
    // En un entorno real, aquí subirías la imagen a un servidor
    // Por ahora, retornamos una URL de datos (data URL)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
```

## 11. Price Reference Service (src/services/priceService.ts)

```typescript
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
```

## 12. Dashboard Service (src/services/dashboardService.ts)

```typescript
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
```

## 13. Utility Functions (src/utils/formatters.ts)

```typescript
// src/utils/formatters.ts

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-AR').format(value);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatTime = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
```

## 14. Validation Utilities (src/utils/validators.ts)

```typescript
// src/utils/validators.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Acepta formatos: +54 11 1234-5678, 011 1234-5678, 1112345678
  const phoneRegex = /^(\+?54)?[\s-]?(\d{2,4})[\s-]?(\d{4})[\s-]?(\d{4})$/;
  return phoneRegex.test(phone);
};

export const validateSKU = (sku: number): boolean => {
  return sku > 0 && Number.isInteger(sku);
};

export const validateStock = (stock: number): boolean => {
  return stock >= 0 && Number.isInteger(stock);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && !isNaN(price);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};
```

## 15. Local Storage Utilities (src/utils/storage.ts)

```typescript
// src/utils/storage.ts

const STORAGE_KEYS = {
  CARRITO: 'ecommerce_carrito',
  CLIENTE_SELECCIONADO: 'ecommerce_cliente_seleccionado',
  THEME: 'ecommerce_theme',
} as const;

export const storage = {
  // Carrito
  getCarrito: <T>(): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CARRITO);
    return data ? JSON.parse(data) : null;
  },

  setCarrito: <T>(carrito: T): void => {
    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(carrito));
  },

  clearCarrito: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CARRITO);
  },

  // Cliente seleccionado
  getClienteSeleccionado: (): number | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTE_SELECCIONADO);
    return data ? parseInt(data) : null;
  },

  setClienteSeleccionado: (idCliente: number): void => {
    localStorage.setItem(STORAGE_KEYS.CLIENTE_SELECCIONADO, idCliente.toString());
  },

  clearClienteSeleccionado: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CLIENTE_SELECCIONADO);
  },

  // Theme
  getTheme: (): 'light' | 'dark' => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Clear all
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
```

---

**Continúa en CODIGO_COMPLETO_PARTE2.md con Contexts, Hooks y Componentes comunes**