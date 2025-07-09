
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import type { Product, Shop } from '@/types';
import { getAllProducts } from '@/services/productService';
import { getAllShops } from '@/services/shopService';
import { ProductList } from '@/components/products/ProductList';
import { ShopList } from '@/components/shops/ShopList';
import { Skeleton } from '@/components/ui/skeleton';
import { Search as SearchIcon, Package, Store } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [allProducts, allShops] = await Promise.all([
        getAllProducts(),
        getAllShops(),
      ]);
      setProducts(allProducts);
      setShops(allShops.filter(s => s.approved)); // Only show approved shops
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const { filteredProducts, filteredShops } = useMemo(() => {
    if (!query) {
      return { filteredProducts: [], filteredShops: [] };
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        (product.manufacturer && product.manufacturer.toLowerCase().includes(lowerCaseQuery)) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
    );

    const filteredShops = shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(lowerCaseQuery) ||
        shop.description.toLowerCase().includes(lowerCaseQuery)
    );

    return { filteredProducts, filteredShops };
  }, [query, products, shops]);

  if (isLoading) {
    return <PageSkeleton />;
  }
  
  const hasResults = filteredProducts.length > 0 || filteredShops.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">
          Search Results for "{query}"
        </h1>
        <p className="text-muted-foreground">
            Found {filteredProducts.length} products and {filteredShops.length} shops.
        </p>
      </div>

      {!hasResults ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No results found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-12">
            {filteredProducts.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="w-6 h-6 text-accent" />
                        <h2 className="text-2xl font-bold font-headline text-primary">Matching Products</h2>
                    </div>
                    <ProductList products={filteredProducts} />
                </section>
            )}

            {filteredShops.length > 0 && (
                 <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Store className="w-6 h-6 text-accent" />
                        <h2 className="text-2xl font-bold font-headline text-primary">Matching Shops</h2>
                    </div>
                    <ShopList shops={filteredShops} />
                </section>
            )}
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="space-y-2">
        <Skeleton className="h-9 w-1/2 max-w-md" />
        <Skeleton className="h-5 w-1/3 max-w-xs" />
      </div>
      
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 max-w-sm" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>

       <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 max-w-sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <SearchResults />
        </Suspense>
    )
}
