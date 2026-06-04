// src/contexts/CarritoContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CarritoItem, Producto, Cliente } from '@types/index';
import { storage } from '@utils/storage';

interface CarritoContextType {
  items: CarritoItem[];
  clienteSeleccionado: Cliente | null;
  setClienteSeleccionado: (cliente: Cliente | null) => void;
  agregarItem: (producto: Producto, cantidad: number) => void;
  actualizarCantidad: (idProducto: number, cantidad: number) => void;
  eliminarItem: (idProducto: number) => void;
  limpiarCarrito: () => void;
  getTotal: () => number;
  getCantidadItems: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CarritoItem[]>(() => {
    return storage.getCarrito<CarritoItem[]>() || [];
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  useEffect(() => {
    storage.setCarrito(items);
  }, [items]);

  const agregarItem = (producto: Producto, cantidad: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.idProducto === producto.idProducto);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.producto.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...prevItems, {
        producto,
        cantidad,
        precioUnitario: producto.valorVenta,
      }];
    });
  };

  const actualizarCantidad = (idProducto: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarItem(idProducto);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.producto.idProducto === idProducto
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const eliminarItem = (idProducto: number) => {
    setItems(prevItems => prevItems.filter(item => item.producto.idProducto !== idProducto));
  };

  const limpiarCarrito = () => {
    setItems([]);
    setClienteSeleccionado(null);
    storage.clearCarrito();
    storage.clearClienteSeleccionado();
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  };

  const getCantidadItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        clienteSeleccionado,
        setClienteSeleccionado,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        limpiarCarrito,
        getTotal,
        getCantidadItems,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito must be used within CarritoProvider');
  }
  return context;
};