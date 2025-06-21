'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, CartItem } from '@/types';
import { toast } from './use-toast';

const CART_STORAGE_KEY = 'electroStoreCart';

interface CartHook {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  itemCount: number;
  getItemQuantity: (productId: string) => number;
  isLoaded: boolean;
}

export function useCart(): CartHook {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
          localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted data
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    if (!isLoaded) return;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stockCount) {
          toast({
            title: "Stock limit reached",
            description: `You cannot add more than ${product.stockCount} units of ${product.name}.`,
            variant: "destructive",
          });
          return prevItems.map(item =>
            item.product.id === product.id ? { ...item, quantity: product.stockCount } : item
          );
        }
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stockCount) {
           toast({
            title: "Stock limit reached",
            description: `You cannot add more than ${product.stockCount} units of ${product.name}.`,
            variant: "destructive",
          });
          return [...prevItems, { product, quantity: product.stockCount }];
        }
        return [...prevItems, { product, quantity }];
      }
    });
  }, [isLoaded]);

  const removeFromCart = useCallback((productId: string) => {
    if (!isLoaded) return;
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, [isLoaded]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!isLoaded) return;
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.product.id === productId);
      if (!itemToUpdate) return prevItems;

      if (quantity <= 0) {
        return prevItems.filter(item => item.product.id !== productId);
      }
      if (quantity > itemToUpdate.product.stockCount) {
        toast({
            title: "Stock limit reached",
            description: `Only ${itemToUpdate.product.stockCount} units of ${itemToUpdate.product.name} available.`,
            variant: "destructive",
          });
        return prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity: itemToUpdate.product.stockCount } : item
        );
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, [isLoaded]);

  const clearCart = useCallback(() => {
    if (!isLoaded) return;
    setCartItems([]);
  }, [isLoaded]);

  const getCartTotal = useCallback(() => {
    if (!isLoaded) return 0;
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems, isLoaded]);

  const itemCount = useMemo(() => {
     if (!isLoaded) return 0;
     return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems, isLoaded]);


  const getItemQuantity = useCallback((productId: string) => {
    if (!isLoaded) return 0;
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems, isLoaded]);


  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, itemCount, getItemQuantity, isLoaded };
}
