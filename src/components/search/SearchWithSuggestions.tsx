
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchWithSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
        router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for phones, TVs, speakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md shadow-sm"
            aria-label="Search products"
          />
        </div>
      </form>
    </div>
  );
}
