'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import type { Shop, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { CartItemCard } from './CartItemCard';
import { getShopById } from '@/services/shopService';
import { Skeleton } from '@/components/ui/skeleton';

export function CartView() {
  const { cartItems, getCartTotal, clearCart, isLoaded } = useCart();
  const [shops, setShops] = useState<Record<string, Shop | null>>({});
  const [isFetchingShops, setIsFetchingShops] = useState(false);

  const groupedCartItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const shopId = item.product.shopId;
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  }, [cartItems]);

  const shopIds = useMemo(() => Object.keys(groupedCartItems), [groupedCartItems]);

  useEffect(() => {
    if (shopIds.length > 0) {
      const fetchShops = async () => {
        setIsFetchingShops(true);
        const shopsToFetch = shopIds.filter(id => !(id in shops));

        if (shopsToFetch.length > 0) {
          const fetchedShops = await Promise.all(
            shopsToFetch.map(id => getShopById(id).catch(err => {
              console.error(`Failed to fetch shop ${id}:`, err);
              return null; // Return null on error to not break Promise.all
            }))
          );

          const newShopsData: Record<string, Shop | null> = {};
          shopsToFetch.forEach((id, index) => {
            newShopsData[id] = fetchedShops[index];
          });
          
          setShops(prevShops => ({ ...prevShops, ...newShopsData }));
        }
        setIsFetchingShops(false);
      };
      fetchShops();
    }
  }, [shopIds]);

  const handleWhatsAppCheckout = (shop: Shop, items: CartItem[]) => {
    if (!shop.whatsappNumber) return;

    const itemsText = items
      .map(item => `${item.product.title} (Qty: ${item.quantity}) - ${(item.product.price * item.quantity).toLocaleString()} XAF`)
      .join(',\n');
    
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString();
    const message = encodeURIComponent(
      `Hello ${shop.name},\nI would like to order the following items from your shop:\n${itemsText}\n\nShop Subtotal: ${total} XAF\n\nThank you!`
    );

    const whatsappUrl = `https://wa.me/${shop.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2 font-headline">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold font-headline text-primary">Your Shopping Cart</h1>
        
        {isFetchingShops && Object.keys(shops).length < shopIds.length && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        )}

        {Object.entries(groupedCartItems).map(([shopId, items]) => {
          const shop = shops[shopId];
          const shopTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

          if (!shop) {
            return (
              <Card key={shopId} className="shadow-md animate-pulse">
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="p-0 border-t"><Skeleton className="h-24 w-full" /></CardContent>
              </Card>
            );
          }

          return (
            <Card key={shopId} className="shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">
                  Items from <Link href={`/shops/${shop.id}`} className="hover:underline text-primary">{shop.name}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t">
                {items.map(item => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-secondary/30">
                <div className="font-semibold text-lg">
                  Shop Subtotal: {shopTotal.toLocaleString()} XAF
                </div>
                <Button
                  onClick={() => handleWhatsAppCheckout(shop, items)}
                  disabled={!shop.whatsappNumber}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Checkout with {shop.name}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <aside className="lg:col-span-1">
        <Card className="shadow-xl rounded-lg sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full flex justify-between items-center text-xl font-bold text-primary">
              <span>Grand Total:</span>
              <span>{getCartTotal().toLocaleString()} XAF</span>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground text-center">
              Shipping & Taxes are calculated via WhatsApp with the vendor.
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-xs text-muted-foreground text-center">
              You need to check out with each shop individually.
            </p>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear Entire Cart
            </Button>
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}
