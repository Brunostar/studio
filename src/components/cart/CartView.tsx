'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItemCard } from './CartItemCard';
import { SHOPS } from '@/lib/mock-data'; // To get shop WhatsApp numbers
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { MessageCircle, ShoppingBag, Loader2 } from 'lucide-react';

export function CartView() {
  const { cartItems, getCartTotal, clearCart, itemCount, isLoaded } = useCart();

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    // For simplicity, use the WhatsApp number of the shop of the first item in the cart.
    // A more robust solution would handle items from multiple shops.
    const firstItemShopId = cartItems[0].product.shopId;
    const shop = SHOPS.find(s => s.id === firstItemShopId);
    const vendorWhatsapp = shop ? shop.vendorWhatsapp : 'YOUR_PLATFORM_FALLBACK_NUMBER'; // Fallback needed

    const itemsText = cartItems
      .map(item => `${item.product.name} (Qty: ${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`)
      .join(',\n');
    
    const total = getCartTotal().toFixed(2);
    const message = encodeURIComponent(
      `Hello ${shop ? shop.name : 'ElectroStore Connect'},\nI would like to order the following items:\n${itemsText}\n\nTotal: $${total}\n\nThank you!`
    );

    // Replace with a valid international phone number format for wa.me
    // Example: for +1234567890, use 1234567890
    const whatsappUrl = `https://wa.me/${vendorWhatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    // Optionally, clear cart after redirecting or after confirmation
    // clearCart(); 
  };
  
  if (!isLoaded) {
    return (
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Your Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (itemCount === 0) {
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
    <Card className="shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Your Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {cartItems.map(item => (
          <CartItemCard key={item.product.id} item={item} />
        ))}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 p-6 bg-secondary/30 rounded-b-lg">
        <div className="w-full flex justify-between items-center text-lg font-semibold">
          <span>Subtotal:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          <span>Shipping & Taxes:</span>
          <span>Calculated at next step</span>
        </div>
        <Separator className="my-2" />
        <div className="w-full flex justify-between items-center text-xl font-bold text-primary">
          <span>Total:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          If your cart contains items from multiple shops, this WhatsApp message will be directed to the owner of the first shop listed. You may need to contact other shop owners separately for other items.
        </p>
        <Button 
          size="lg" 
          className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground" 
          onClick={handleWhatsAppCheckout}
          disabled={cartItems.length === 0}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Checkout via WhatsApp
        </Button>
        <Button variant="outline" className="w-full" onClick={clearCart}>
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
