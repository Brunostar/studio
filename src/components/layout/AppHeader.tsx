
'use client';

import Link from 'next/link';
import { Package2, MapPin } from 'lucide-react';
import { NavLink } from './NavLink';
import { CartIcon } from '@/components/cart/CartIcon';
import SearchWithSuggestions from '@/components/search/SearchWithSuggestions';
import { AuthStatus } from '../auth/AuthStatus';
import { useMarket } from '@/context/MarketContext';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

function CurrentMarketDisplay() {
  const { selectedMarket, isMarketLoading } = useMarket();

  if (isMarketLoading) {
    return <Skeleton className="h-9 w-40 hidden md:flex" />;
  }

  if (!selectedMarket) {
    return null; // Don't show anything if no market is selected
  }

  return (
    <Button variant="ghost" size="sm" asChild className="hidden md:flex">
      <Link href="/" className="text-muted-foreground">
        <MapPin className="mr-2 h-4 w-4" />
        Market: <span className="text-foreground font-semibold ml-1">{selectedMarket}</span>
      </Link>
    </Button>
  );
}


export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Left Part: Logo and Desktop Nav */}
        <div className="flex items-center">
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
        </div>

        {/* Spacer to push right content */}
        <div className="flex-1" />

        {/* Right Part: Search, Cart, Auth */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <CurrentMarketDisplay />
          <SearchWithSuggestions />
          <div className="hidden md:flex">
            <CartIcon />
          </div>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
