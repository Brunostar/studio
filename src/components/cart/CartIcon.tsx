'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export function CartIcon() {
  const { itemCount, isLoaded } = useCart();

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart" aria-label="View cart">
        <ShoppingCart className="h-5 w-5" />
        {isLoaded && itemCount > 0 && (
          <>
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
              aria-hidden="true"
            >
              {itemCount}
            </span>
            <span className="sr-only">View cart with {itemCount} items</span>
          </>
        )}
      </Link>
    </Button>
  );
}
