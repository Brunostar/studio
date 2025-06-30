'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Store, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect, type ReactNode } from 'react';

interface BottomNavLinkProps {
  href: string;
  label: string;
  children: ReactNode;
  isCart?: boolean;
}

function BottomNavLink({ href, label, children, isCart = false }: BottomNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === "/products" && pathname.startsWith("/products"));
  const { itemCount } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-1 p-2 text-xs transition-colors duration-200",
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/80'
      )}
    >
      {isCart && isClient && itemCount > 0 && (
        <span
          className="absolute top-1 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
          aria-hidden="true"
        >
          {itemCount}
        </span>
      )}
      {children}
      <span className={cn('truncate', isActive && 'font-semibold')}>
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t border-border/40">
      <div className="flex h-full items-stretch">
        <BottomNavLink href="/" label="Home">
          <Home className="h-5 w-5" />
        </BottomNavLink>
        <BottomNavLink href="/products" label="Products">
          <ShoppingBag className="h-5 w-5" />
        </BottomNavLink>
        <BottomNavLink href="/shops" label="Shops">
          <Store className="h-5 w-5" />
        </BottomNavLink>
        <BottomNavLink href="/cart" label="Cart" isCart>
          <ShoppingCart className="h-5 w-5" />
        </BottomNavLink>
      </div>
    </nav>
  );
}
