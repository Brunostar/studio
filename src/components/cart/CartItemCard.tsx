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
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          sizes="80px"
          className="object-cover"
          data-ai-hint={item.product.dataAiHint || "product image"}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-md">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label={`Decrease quantity of ${item.product.name}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          max={item.product.stockCount}
          className="h-9 w-14 text-center"
          aria-label={`Quantity of ${item.product.name}`}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.stockCount}
          aria-label={`Increase quantity of ${item.product.name}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-semibold w-20 text-right">${(item.product.price * item.quantity).toFixed(2)}</p>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive/80"
        onClick={() => removeFromCart(item.product.id)}
        aria-label={`Remove ${item.product.name} from cart`}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
