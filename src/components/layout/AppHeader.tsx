
'use client';

import Link from 'next/link';
import { Package2 } from 'lucide-react';
import { NavLink } from './NavLink';
import { CartIcon } from '@/components/cart/CartIcon';
import SearchWithSuggestions from '@/components/search/SearchWithSuggestions';
import { AuthStatus } from '../auth/AuthStatus';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline text-primary">
            Cameroon Market
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/shops">Shops</NavLink>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <SearchWithSuggestions />
          </div>
          <div className="hidden md:flex">
            <CartIcon />
          </div>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
