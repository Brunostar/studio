'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShopList } from '@/components/shops/ShopList';
import { getAllShops } from '@/services/shopService';
import type { Shop } from '@/types';
import { useMarket } from '@/context/MarketContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ShopsPage() {
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedMarket, isMarketLoading } = useMarket();

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
    return allShops.filter(shop => shop.category === selectedMarket);
  }, [allShops, selectedMarket]);

  if (isLoading || isMarketLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-9 w-1/2 max-w-sm mx-auto mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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

  if (!selectedMarket) {
      return (
        <div className="container mx-auto px-4 py-8">
             <Card className="text-center">
                 <CardHeader>
                     <CardTitle>No Market Selected</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p>Please select a market from the homepage to browse shops.</p>
                     <Button asChild className="mt-4">
                         <Link href="/">Go to Homepage</Link>
                     </Button>
                 </CardContent>
             </Card>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">
        Discover Shops in {selectedMarket}
      </h1>
      <ShopList shops={filteredShops} />
    </div>
  );
}
