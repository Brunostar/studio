import Image from 'next/image';
import Link from 'next/link';
import type { Shop } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <Card className="overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl h-full flex flex-col">
        <CardHeader className="p-0 relative aspect-[2/1] w-full">
          <Image
            src={shop.bannerUrl}
            alt={`${shop.name} banner`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={shop.dataAiHintBanner || "shop banner"}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center mb-2">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-border">
              <Image
                src={shop.logoUrl}
                alt={`${shop.name} logo`}
                fill
                className="object-cover"
                data-ai-hint={shop.dataAiHintLogo || "shop logo"}
              />
            </div>
            <CardTitle className="text-lg font-semibold group-hover:underline font-headline">{shop.name}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
