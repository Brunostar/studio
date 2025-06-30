
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductList } from '@/components/products/ProductList';
import { CategoryTabs } from '@/components/products/CategoryTabs';
import { MARKET_CATEGORIES } from '@/lib/mock-data';
import { getAllProducts } from '@/services/productService';
import type { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const mainCategory = searchParams.get('category');
  
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category>('All');

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
      // If no main category, show all products (or based on search)
       const prods = searchQuery 
        ? products.filter(product => 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : products;
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
        tempProducts = tempProducts.filter(product => 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return tempProducts;
  }, [selectedSubCategory, productsInMainCategory, searchQuery, mainCategory]);
  
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (mainCategory) {
      return `${mainCategory} Market`;
    }
    return "Our Products";
  };
  
  if (!mainCategory && !searchQuery) {
      return (
        <div className="container mx-auto px-4 py-8">
             <Card className="text-center">
                 <CardHeader>
                     <CardTitle>No Market Selected</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p>Please select a market from the homepage to start browsing.</p>
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
        {getPageTitle()}
      </h1>
      
      {mainCategory && subCategories.length > 1 && (
        <CategoryTabs 
          categories={subCategories} 
          selectedCategory={selectedSubCategory} 
          onSelectCategory={setSelectedSubCategory} 
        />
      )}

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
