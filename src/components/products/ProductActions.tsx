
'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.stock) {
      setQuantity(product.stock);
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} units available.`,
        variant: "destructive",
      });
    } else {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      toast({
        title: `Added to cart!`,
        description: `${quantity} x ${product.title} has been added.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {product.stock > 0 ? (
        <Badge variant="secondary">In Stock ({product.stock} available)</Badge>
      ) : (
        <Badge variant="destructive">Out of Stock</Badge>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center justify-center gap-2">
           <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || product.stock === 0}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
              min="1"
              max={product.stock}
              className="h-10 w-16 text-center"
              disabled={product.stock === 0}
              aria-label="Product quantity"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock || product.stock === 0}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
        </div>
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-grow bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
