
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/products/ProductList';
import { CategoryTabs } from '@/components/products/CategoryTabs';
import { CATEGORIES } from '@/lib/mock-data';
import { getAllProducts } from '@/services/productService';
import type { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]); // Default to 'All'
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let tempProducts = products;
    
    if (selectedCategory !== 'All') {
      tempProducts = tempProducts.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
        tempProducts = tempProducts.filter(product => 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return tempProducts;
  }, [selectedCategory, products, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      {searchQuery ? (
        <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">
          Search Results for "{searchQuery}"
        </h1>
      ) : (
        <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">Our Products</h1>
      )}
      <CategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
}
