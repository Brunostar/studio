import Image from 'next/image';
import { ProductList } from '@/components/products/ProductList';
import { PRODUCTS } from '@/lib/mock-data';
import type { Shop, Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { getAllShops, getShopById } from '@/services/shopService';

interface ShopPageParams {
  params: { shopId: string };
}

export async function generateStaticParams() {
  const shops = await getAllShops();
  return shops.map((shop) => ({
    shopId: shop.id,
  }));
}

export default async function ShopPage({ params }: ShopPageParams) {
  const shop: Shop | null = await getShopById(params.shopId);
  
  if (!shop) {
    notFound();
  }

  const shopProducts: Product[] = PRODUCTS.filter(p => p.shopId === params.shopId);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 overflow-hidden shadow-lg">
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={shop.bannerUrl}
            alt={`${shop.name} banner`}
            fill
            className="object-cover"
            data-ai-hint={shop.dataAiHintBanner || "shop banner"}
            priority
          />
        </div>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6">
           <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background shadow-md flex-shrink-0 -mt-12 md:-mt-16">
            <Image
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              fill
              className="object-cover"
              data-ai-hint={shop.dataAiHintLogo || "shop logo"}
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold font-headline text-primary">{shop.name}</CardTitle>
            <p className="text-muted-foreground mt-1">{shop.description}</p>
            {shop.vendorWhatsapp && (
                 <a 
                    href={`https://wa.me/${shop.vendorWhatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm text-accent hover:text-accent/80 font-medium"
                 >
                    Contact on WhatsApp
                 </a>
            )}
          </div>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-semibold mb-6 font-headline text-primary">Products from {shop.name}</h2>
      {shopProducts.length > 0 ? (
        <ProductList products={shopProducts} />
      ) : (
        <p className="text-center text-muted-foreground py-8">This shop currently has no products listed.</p>
      )}
    </div>
  );
}
