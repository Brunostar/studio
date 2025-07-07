'use client';

import Image from 'next/image';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity);
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.product.images[0] || 'https://placehold.co/600x600.png'}
          alt={item.product.title || 'Product image'}
          fill
          sizes="96px"
          className="object-cover"
          data-ai-hint={item.product.dataAiHint || "product image"}
        />
      </div>
      <div className="flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-grow pr-2">
            <h3 className="font-semibold text-sm md:text-base leading-tight">{item.product.title}</h3>
            <p className="text-sm text-muted-foreground">{item.product.price.toLocaleString()} XAF</p>
          </div>
           <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/80 flex-shrink-0"
              onClick={() => removeFromCart(item.product.id)}
              aria-label={`Remove ${item.product.title} from cart`}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.product.title}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
              min="1"
              max={item.product.stock}
              className="h-8 w-12 text-center"
              aria-label={`Quantity of ${item.product.title}`}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              aria-label={`Increase quantity of ${item.product.title}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="font-semibold text-sm md:text-base text-right">{(item.product.price * item.quantity).toLocaleString()} XAF</p>
        </div>
      </div>
    </div>
  );
}
