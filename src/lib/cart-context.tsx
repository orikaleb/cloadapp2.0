'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  inStock?: boolean;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: { id: string | number; name: string; price: number; image: string; inStock?: boolean }, requireAuth?: boolean) => boolean;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  processPendingItems: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('userAuth');
      return !!authData;
    }
    return false;
  };

  // Internal function to add to cart without auth check
  const addToCartInternal = (product: { id: string | number; name: string; price: number; image: string; inStock?: boolean }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Process pending items after login
  const processPendingItems = () => {
    if (typeof window !== 'undefined' && isAuthenticated()) {
      const pendingItems = localStorage.getItem('pendingCartItems');
      if (pendingItems) {
        try {
          const items: CartItem[] = JSON.parse(pendingItems);
          items.forEach((item) => {
            addToCartInternal(item);
          });
          localStorage.removeItem('pendingCartItems');
        } catch (error) {
          console.error('Failed to process pending items:', error);
        }
      }
    }
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Check for pending items periodically (when auth might change)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      const interval = setInterval(() => {
        if (isAuthenticated()) {
          processPendingItems();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Public function that checks authentication
  const addToCart = (product: { id: string | number; name: string; price: number; image: string; inStock?: boolean }, requireAuth: boolean = true): boolean => {
    if (requireAuth && !isAuthenticated()) {
      // Store pending item
      if (typeof window !== 'undefined') {
        const pendingItems = localStorage.getItem('pendingCartItems');
        const items = pendingItems ? JSON.parse(pendingItems) : [];
        items.push({ ...product, quantity: 1 });
        localStorage.setItem('pendingCartItems', JSON.stringify(items));
      }
      // Redirect to login
      window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    
    addToCartInternal(product);
    return true;
  };

  const removeFromCart = (id: string | number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        processPendingItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
