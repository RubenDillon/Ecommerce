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