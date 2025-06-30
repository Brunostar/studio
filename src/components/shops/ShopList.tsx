import type { Shop } from '@/types';
import { ShopCard } from './ShopCard';

interface ShopListProps {
  shops: Shop[];
}

export function ShopList({ shops }: ShopListProps) {
  if (!shops || shops.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No shops found.</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
