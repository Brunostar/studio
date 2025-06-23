import { ShopList } from '@/components/shops/ShopList';
import { getAllShops } from '@/services/shopService';
import type { Shop } from '@/types';

export default async function ShopsPage() {
  const allShops: Shop[] = await getAllShops();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">Discover Our Shops</h1>
      <ShopList shops={allShops} />
    </div>
  );
}
