// contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContextType, ProductoPersonalizado } from '@/interfaces/Cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProductoPersonalizado[]>([]);

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Guardar carrito en AsyncStorage cuando cambie
  useEffect(() => {
    saveCart();
  }, [items]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (producto: ProductoPersonalizado) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.producto_id === producto.producto_id && 
        JSON.stringify(item.ingredientes) === JSON.stringify(producto.ingredientes)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].cantidad += producto.cantidad;
        return updated;
      } else {
        return [...prev, producto];
      }
    });
  };

  const removeFromCart = (productoId: number) => {
    setItems(prev => prev.filter(item => item.producto_id !== productoId));
  };

  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.producto_id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.producto_precio * item.cantidad), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.cantidad, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};