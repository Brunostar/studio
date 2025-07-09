
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function SearchWithSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
        setIsOpen(false); // Close sheet on search
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleDesktopSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(searchTerm);
  };
  
  const handleMobileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(mobileSearchTerm);
  };
  
  // Reset mobile search term when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setMobileSearchTerm(''), 100);
    }
  }, [isOpen]);

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden md:block relative w-full max-w-md">
        <form onSubmit={handleDesktopSubmit} role="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for phones, TVs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md shadow-sm"
                aria-label="Search products"
              />
            </div>
        </form>
      </div>

      {/* Mobile Search Icon & Sheet */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Open Search</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="p-4 pt-6">
             <SheetHeader>
                <SheetTitle className="sr-only">Search Products</SheetTitle>
             </SheetHeader>
             <form onSubmit={handleMobileSubmit} role="search" className="w-full mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search all products..."
                    value={mobileSearchTerm}
                    onChange={(e) => setMobileSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full h-12 text-lg rounded-md shadow-sm"
                    aria-label="Search products"
                    autoFocus
                  />
                </div>
              </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
