
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, 1);
      toast({
        title: `${product.title} added to cart`,
        description: "You can view your cart or continue shopping.",
      });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg h-full border">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.title}`}>
          <div className="aspect-square relative w-full bg-muted">
            <Image
              src={product.images[0] || 'https://placehold.co/600x600.png'}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={product.dataAiHint || "product image"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-2 flex-grow">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <CardTitle className="text-sm font-semibold mb-1 line-clamp-2">{product.title}</CardTitle>
        </Link>
        <p className="text-sm font-bold text-primary mb-2">{product.price.toLocaleString()} XAF</p>
        {product.stock <= 0 && (
          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <Badge variant="secondary" className="text-xs">Low Stock</Badge>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t mt-auto">
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock <= 0}
          className="w-full"
          variant="outline"
          size="sm"
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
