

'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Laptop, Car, Shirt, ToyBrick, Home as HomeIcon, BookOpen, Star, Store } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMarket } from '@/context/MarketContext';
import { ProductList } from '@/components/products/ProductList';
import { ShopList } from '@/components/shops/ShopList';
import type { Product, Shop } from '@/types';
import { useState, useEffect } from 'react';
import { getAllProducts } from '@/services/productService';
import { getAllShops } from '@/services/shopService';
import { Skeleton } from '@/components/ui/skeleton';

const marketCategories: { name: string; description: string; slug: string; icon: ReactNode; }[] = [
  { name: 'Electronics', slug: 'Electronics', description: 'Gadgets & more', icon: <Laptop className="w-8 h-8" /> },
  { name: 'Automotive', slug: 'Automotive', description: 'Parts & vehicles', icon: <Car className="w-8 h-8" /> },
  { name: 'Fashion', slug: 'Fashion', description: 'Apparel & shoes', icon: <Shirt className="w-8 h-8" /> },
  { name: 'Toys', slug: 'Toys', description: 'Fun for all ages', icon: <ToyBrick className="w-8 h-8" /> },
  { name: 'Home Goods', slug: 'Home Goods', description: 'Furniture & decor', icon: <HomeIcon className="w-8 h-8" /> },
  { name: 'Books', slug: 'Books', description: 'Books & more', icon: <BookOpen className="w-8 h-8" /> },
];

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ShopGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}


export default function HomePage() {
  const { setSelectedMarket } = useMarket();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [popularShops, setPopularShops] = useState<Shop[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingShops, setIsLoadingShops] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      const allProducts = await getAllProducts();
      setPopularProducts(allProducts.slice(0, 12));
      setIsLoadingProducts(false);
    };

    const fetchShops = async () => {
      setIsLoadingShops(true);
      const allShops = await getAllShops();
      setPopularShops(allShops.filter(s => s.approved).slice(0, 4));
      setIsLoadingShops(false);
    }

    fetchProducts();
    fetchShops();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-headline text-primary">Your Local Marketplace, Reimagined</h1>
        <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Find everything you need, right in your neighborhood.
        </p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {marketCategories.map((category) => (
            <Link 
              href="/products" 
              onClick={() => setSelectedMarket(category.slug)} 
              key={category.slug} 
              className="group"
            >
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <CardHeader className="flex flex-col items-center text-center gap-2 p-3 sm:p-4">
                  <div className="p-3 bg-primary/10 rounded-full text-accent">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm md:text-base font-bold group-hover:text-accent">{category.name}</CardTitle>
                    <CardDescription className="hidden sm:block mt-1 text-xs">{category.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold font-headline text-primary">Popular Products</h2>
        </div>
        {isLoadingProducts ? (
          <ProductGridSkeleton />
        ) : (
          <ProductList products={popularProducts} />
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold font-headline text-primary">Popular Shops</h2>
        </div>
        {isLoadingShops ? (
          <ShopGridSkeleton />
        ) : (
          <ShopList shops={popularShops} />
        )}
      </section>
    </div>
  );
}
