import { ShopList } from '@/components/shops/ShopList';
import { SHOPS } from '@/lib/mock-data';
import type { Shop } from '@/types';

export default function ShopsPage() {
  const allShops: Shop[] = SHOPS;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">Discover Our Shops</h1>
      <ShopList shops={allShops} />
    </div>
  );
}
