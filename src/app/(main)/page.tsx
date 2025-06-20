import { ProductList } from '@/components/products/ProductList';
import { ShopList } from '@/components/shops/ShopList';
import { PRODUCTS, SHOPS } from '@/lib/mock-data';
import type { Product, Shop } from '@/types';

export default function HomePage() {
  const popularProducts: Product[] = PRODUCTS.filter(p => p.isPopular).slice(0, 4);
  const featuredShops: Shop[] = SHOPS.filter(s => s.isFeatured).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-headline text-primary">Welcome to ElectroStore Connect</h1>
        <p className="text-lg text-muted-foreground">
          Discover the latest electronics from trusted vendors.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 font-headline text-primary border-b pb-2">Popular Products</h2>
        <ProductList products={popularProducts} />
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 font-headline text-primary border-b pb-2">Featured Shops</h2>
        <ShopList shops={featuredShops} />
      </section>
    </div>
  );
}
