
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShopList } from '@/components/shops/ShopList';
import { getAllShops } from '@/services/shopService';
import type { Shop, Category } from '@/types';
import { useMarket } from '@/context/MarketContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/mock-data';

function PageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-10 w-full sm:w-[250px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[150px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ShopsPage() {
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedMarket, setSelectedMarket, isMarketLoading } = useMarket();

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      const shops = await getAllShops();
      setAllShops(shops);
      setIsLoading(false);
    };
    fetchShops();
  }, []);

  const filteredShops = useMemo(() => {
    if (!selectedMarket) {
      return [];
    }
    // Only show approved shops in the selected market
    return allShops.filter(shop => shop.approved && shop.category === selectedMarket);
  }, [allShops, selectedMarket]);

  if (isLoading || isMarketLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">
          {selectedMarket ? `Shops in ${selectedMarket}` : 'Discover Shops'}
        </h1>
        <Select value={selectedMarket || ''} onValueChange={(value) => setSelectedMarket(value as Category)}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a market..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
      <ShopList shops={filteredShops} />
    </div>
  );
}
