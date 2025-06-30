
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Laptop, Car, Shirt, ToyBrick, Home as HomeIcon, BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';

const marketCategories: { name: string; description: string; slug: string; icon: ReactNode; }[] = [
  { name: 'Electronics', slug: 'Electronics', description: 'Gadgets, devices, and more.', icon: <Laptop className="w-10 h-10" /> },
  { name: 'Automotive', slug: 'Automotive', description: 'Parts, accessories, and vehicles.', icon: <Car className="w-10 h-10" /> },
  { name: 'Fashion', slug: 'Fashion', description: 'Apparel, shoes, and accessories.', icon: <Shirt className="w-10 h-10" /> },
  { name: 'Toys', slug: 'Toys', description: 'Fun and games for all ages.', icon: <ToyBrick className="w-10 h-10" /> },
  { name: 'Home Goods', slug: 'Home Goods', description: 'Furniture, decor, and appliances.', icon: <HomeIcon className="w-10 h-10" /> },
  { name: 'Books', slug: 'Books', description: 'Literature, textbooks, and more.', icon: <BookOpen className="w-10 h-10" /> },
];


export default async function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-headline text-primary">Welcome to Cameroon Market</h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your central hub for discovering products from vendors across Cameroon. Select a market to begin your search.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {marketCategories.map((category) => (
            <Link href={`/products?category=${encodeURIComponent(category.slug)}`} key={category.slug} className="group">
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <CardHeader className="flex flex-col items-center text-center gap-4 p-6">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold group-hover:text-accent">{category.name}</CardTitle>
                    <CardDescription className="mt-2">{category.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
