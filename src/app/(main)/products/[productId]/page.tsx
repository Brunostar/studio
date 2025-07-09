
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductActions } from '@/components/products/ProductActions';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { getShopById } from '@/services/shopService';
import { getAllProducts, getProductById } from '@/services/productService';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProductList } from '@/components/products/ProductList';

interface ProductPageParams {
  params: { productId: string };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { productId } = params;
  const product = await getProductById(productId);
  
  if (!product) {
    notFound();
  }

  const shop = await getShopById(product.shopId);
  
  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
       <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
         <ArrowLeft className="h-4 w-4" />
         Back to Products
      </Link>
      <Card className="overflow-hidden shadow-lg mb-12">
        <div className="grid md:grid-cols-2">
          <div className="p-4 md:p-6">
            <ProductImageCarousel 
              images={product.images} 
              altText={product.title} 
              dataAiHint={product.dataAiHint}
            />
          </div>
          <div className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2">{product.category}</Badge>
                    <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">{product.title}</h1>
                    {product.manufacturer && (
                        <p className="text-sm text-muted-foreground mt-1">by {product.manufacturer}</p>
                    )}
                  </div>
                  {shop && (
                    <Link href={`/shops/${shop.id}`} className="text-sm font-medium text-muted-foreground hover:underline shrink-0">
                      Sold by {shop.name}
                    </Link>
                  )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-accent mb-4">{product.price.toLocaleString()} XAF</p>
                  <Separator className="my-4" />
                  <h2 className="text-lg font-semibold mb-2">About this item</h2>
                  <p className="text-base md:text-lg text-muted-foreground">{product.description}</p>
                </div>
                <div className="pt-4">
                  <ProductActions product={product} />
                </div>
            </CardContent>
          </div>
        </div>
      </Card>
      
       {product.features && product.features.length > 0 && (
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              {product.features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-3">
                  <dt className="font-semibold text-sm text-foreground">{feature.name}</dt>
                  <dd className="text-muted-foreground text-sm col-span-2">{feature.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
      
      <div className="mb-12">
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">Important: Buyer Safety Warning</AlertTitle>
            <AlertDescription>
              For your safety, do not make any payments online. Always arrange to meet the vendor in person, thoroughly inspect the product to ensure it meets your expectations, and pay only upon collection.
            </AlertDescription>
        </Alert>
      </div>

      {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 font-headline text-primary">Related Products</h2>
            <ProductList products={relatedProducts} />
          </section>
      )}
    </div>
  );
}
