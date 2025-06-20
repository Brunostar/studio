'use client';

import { useState, useMemo } from 'react';
import { ProductList } from '@/components/products/ProductList';
import { CategoryTabs } from '@/components/products/CategoryTabs';
import { PRODUCTS, CATEGORIES } from '@/lib/mock-data';
import type { Product, Category } from '@/types';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]); // Default to 'All'

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return PRODUCTS;
    }
    return PRODUCTS.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">Our Products</h1>
      <CategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <ProductList products={filteredProducts} />
    </div>
  );
}
