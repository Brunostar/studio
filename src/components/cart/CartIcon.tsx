'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart" aria-label={`View cart with ${itemCount} items`}>
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
