'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CATEGORIES } from '@/lib/mock-data';
import type { Category } from '@/types';

interface CategoryTabsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <Tabs value={selectedCategory} onValueChange={onSelectCategory} className="mb-8">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {CATEGORIES.map((category) => (
          <TabsTrigger key={category} value={category} className="text-sm">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
