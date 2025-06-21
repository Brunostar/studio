import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PRODUCTS, SHOPS } from '@/lib/mock-data';
import type { Product } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { ProductActions } from '@/components/products/ProductActions';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface ProductPageParams {
  params: { productId: string };
}

// Generate static pages for all products at build time
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    productId: product.id,
  }));
}

// Component for the AI-generated description with a loading fallback
async function AiDescription({ product }: { product: Product }) {
  try {
    const { generatedDescription } = await generateProductDescription({
      productName: product.name,
      productDescription: product.description,
    });
    return <p className="text-lg text-muted-foreground">{generatedDescription}</p>;
  } catch (error) {
    console.error("Failed to generate AI description, falling back to original.", error);
    // Fallback to the original description if AI fails
    return <p className="text-lg text-muted-foreground">{product.description}</p>;
  }
}

export default async function ProductPage({ params }: ProductPageParams) {
  const product = PRODUCTS.find(p => p.id === params.productId);
  
  if (!product) {
    notFound();
  }

  const shop = SHOPS.find(s => s.id === product.shopId);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
       <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
         <ArrowLeft className="h-4 w-4" />
         Back to Products
      </Link>
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              data-ai-hint={product.dataAiHint || "product image"}
            />
          </div>
          <div className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2">{product.category}</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{product.name}</h1>
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
                  <p className="text-3xl font-bold text-accent mb-4">${product.price.toFixed(2)}</p>
                  <Separator className="my-4" />
                  <h2 className="text-xl font-semibold mb-2">About this item</h2>
                  <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                     <AiDescription product={product} />
                  </Suspense>
                </div>
                <div className="pt-4">
                  <ProductActions product={product} />
                </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
