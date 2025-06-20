'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { suggestProducts, SuggestProductsInput } from '@/ai/flows/smart-product-suggestion';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming a debounce hook exists or will be created

// A simple debounce hook implementation if not available elsewhere
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


export default function SearchWithSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

  const fetchSuggestions = useCallback(async (input: SuggestProductsInput) => {
    if (!input.searchInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    setShowSuggestions(true);
    try {
      const result = await suggestProducts(input);
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      // Optionally show a toast message for the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions({ searchInput: debouncedSearchTerm });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion); // Fill search bar with suggestion
    setShowSuggestions(false);
    // Here you might want to trigger a search based on the suggestion,
    // e.g., router.push(`/products?search=${suggestion}`);
    console.log("Selected suggestion:", suggestion);
  };
  
  const handleBlur = () => {
    // Delay hiding suggestions to allow click event on suggestions to fire
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for phones, TVs, speakers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          onBlur={handleBlur}
          className="pl-10 pr-4 py-2 w-full rounded-md shadow-sm"
          aria-label="Search products"
        />
      </div>
      {showSuggestions && (searchTerm.length > 0) && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg rounded-md border">
          <CardContent className="p-2 max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading suggestions...</span>
              </div>
            )}
            {!isLoading && suggestions.length === 0 && searchTerm.length > 0 && (
              <p className="p-4 text-sm text-center text-muted-foreground">No suggestions found.</p>
            )}
            {!isLoading && suggestions.length > 0 && (
              <ul role="listbox">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    role="option"
                    aria-selected="false"
                    className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                    onMouseDown={(e) => { // Use onMouseDown to ensure it fires before blur
                        e.preventDefault(); // Prevent input blur
                        handleSuggestionClick(suggestion);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
