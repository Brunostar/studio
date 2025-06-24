
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
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.title}`}>
          <div className="aspect-square relative w-full">
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
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <CardTitle className="text-lg font-semibold mb-1 font-headline">{product.title}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        <p className="text-xl font-bold text-primary mb-2">${product.price.toFixed(2)}</p>
        {product.stock <= 0 && (
          <Badge variant="destructive" className="mb-2">Out of Stock</Badge>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <Badge variant="secondary" className="mb-2">Low Stock: {product.stock} left</Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock <= 0}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
