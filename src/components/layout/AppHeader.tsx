
'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { NavLink } from '@/components/layout/NavLink';
import { CartIcon } from '@/components/cart/CartIcon';
import SearchWithSuggestions from '@/components/search/SearchWithSuggestions';
import { AuthStatus } from '@/components/auth/AuthStatus';
import { useMarket } from '@/context/MarketContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

function CurrentMarketDisplay() {
  const { selectedMarket, isMarketLoading } = useMarket();

  // On the server, or on the client before the market is loaded from localStorage,
  // isMarketLoading will be true.
  if (isMarketLoading) {
    // Render a placeholder that is consistent on both server and client initial render.
    return <Skeleton className="h-9 w-40 hidden md:flex" />;
  }

  // After loading on the client, if no market is selected, render nothing.
  if (!selectedMarket) {
    return null;
  }

  // Once loaded on the client and a market is selected, render the market display.
  return (
    <Button variant="ghost" size="sm" asChild className="hidden md:flex">
      <Link href="/" className="text-muted-foreground">
        <MapPin className="mr-2 h-4 w-4" />
        Market: <span className="text-foreground font-semibold ml-1">{selectedMarket}</span>
      </Link>
    </Button>
  );
}

function BatoLogo() {
  return (
    <div className="flex items-center space-x-1">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-primary"
        aria-label="Bato logo"
      >
        <path d="M4.75 3.75H19.25V5.25H4.75V3.75Z" />
        <path d="M4.75 5.25C4.75 4.92289 5.02289 4.65 5.35 4.65H18.65C18.9771 4.65 19.25 4.92289 19.25 5.25V7.05263C18.6517 7.35088 17.985 7.5 17.35 7.5C16.715 7.5 16.0483 7.35088 15.45 7.05263C14.8517 7.35088 14.185 7.5 13.55 7.5C12.915 7.5 12.2483 7.35088 11.65 7.05263C11.0517 7.35088 10.385 7.5 9.75 7.5C9.115 7.5 8.44833 7.35088 7.85 7.05263C7.25167 7.35088 6.585 7.5 5.95 7.5C5.315 7.5 4.75 7.15789 4.75 7.05263V5.25Z" />
        <path d="M7.25 8.75H13.25C14.2165 8.75 15 9.5335 15 10.5C15 11.4665 14.2165 12.25 13.25 12.25H7.25V8.75Z" />
        <path d="M7.25 13.25H14.25C15.9069 13.25 17.25 14.5931 17.25 16.25C17.25 17.9069 15.9069 19.25 14.25 19.25H7.25V13.25Z" />
      </svg>
      <span className="font-bold sm:inline-block font-headline text-primary text-2xl">
        Bato
      </span>
    </div>
  );
}


export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Part: Logo and Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <BatoLogo />
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/shops">Shops</NavLink>
          </nav>
        </div>

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
