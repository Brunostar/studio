

'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/products/ProductList';
import { CategoryTabs } from '@/components/products/CategoryTabs';
import { MARKET_CATEGORIES, CATEGORIES } from '@/lib/mock-data';
import { getAllProducts } from '@/services/productService';
import type { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarket } from '@/context/MarketContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const { selectedMarket: mainCategory, setSelectedMarket, isMarketLoading } = useMarket();
  
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category>('All');

  const filterBySearchQuery = (product: Product, query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return (
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        (product.manufacturer && product.manufacturer.toLowerCase().includes(lowerCaseQuery))
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);
  
  // Reset sub-category when main category changes
  useEffect(() => {
    setSelectedSubCategory('All');
  }, [mainCategory]);

  const { productsInMainCategory, subCategories } = useMemo(() => {
    if (!mainCategory) {
      // If no main category, show products based on search
       const prods = searchQuery 
        ? products.filter(product => filterBySearchQuery(product, searchQuery))
        : []; // Don't show all products, prompt to select market
      return { productsInMainCategory: prods, subCategories: [] };
    }

    const productsInMainCategory = products.filter(p => p.category === mainCategory);
    const subCategories = MARKET_CATEGORIES[mainCategory] || ['All'];
    
    return { productsInMainCategory, subCategories };
  }, [mainCategory, products, searchQuery]);


  const filteredProducts = useMemo(() => {
    let tempProducts = productsInMainCategory;
    
    if (selectedSubCategory !== 'All') {
      tempProducts = tempProducts.filter(product => product.subCategory === selectedSubCategory);
    }
    
    // Search query is now applied at the main category level above
    // so we don't need to re-apply it here unless mainCategory is not present
    if (!mainCategory && searchQuery) {
        tempProducts = tempProducts.filter(product => filterBySearchQuery(product, searchQuery));
    }

    return tempProducts;
  }, [selectedSubCategory, productsInMainCategory, searchQuery, mainCategory]);
  
  if (isMarketLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Browsing Market:'}
        </h1>
        {!searchQuery && (
          <Select value={mainCategory || ''} onValueChange={(value) => setSelectedMarket(value as Category)}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a market..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {mainCategory && subCategories.length > 1 && (
        <div className="mb-8">
          <CategoryTabs 
            categories={subCategories} 
            selectedCategory={selectedSubCategory} 
            onSelectCategory={setSelectedSubCategory} 
          />
        </div>
      )}

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-9 w-1/2 max-w-sm mx-auto mb-8" />
      <Skeleton className="h-10 w-full max-w-lg mx-auto mb-8" />
      <ProductGridSkeleton />
    </div>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  )
}
