'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProductsByShopId } from '@/services/productService';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, ShoppingBag, Lock, Pencil } from 'lucide-react';

export default function VendorProductsPage() {
  const { user, loading, isVendor } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isVendor) {
      const fetchProducts = async () => {
        setIsFetchingProducts(true);
        const vendorProducts = await getProductsByShopId(user.uid);
        setProducts(vendorProducts);
        setIsFetchingProducts(false);
      };
      fetchProducts();
    } else if (!loading) {
       setIsFetchingProducts(false);
    }
  }, [user, isVendor, loading]);
  
  if (loading || isFetchingProducts) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isVendor) {
     return (
       <div className="flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You must be an approved vendor to manage products.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">Your Products</h1>
          <p className="text-muted-foreground">A list of all products in your shop.</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/vendor/add-product">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first product.</p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/vendor/add-product">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="flex gap-4">
                    <div className="relative w-24 h-auto flex-shrink-0 bg-muted">
                        <Image
                            src={product.images[0] || 'https://placehold.co/100x100.png'}
                            alt={product.title}
                            width={100}
                            height={100}
                            className="object-cover h-full w-full"
                            data-ai-hint={product.dataAiHint || "product image"}
                        />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-center">
                        <div>
                            <Badge variant="outline" className="mb-1">{product.category}</Badge>
                            <h3 className="font-semibold leading-tight">{product.title}</h3>
                            <p className="text-sm text-primary font-bold">{product.price.toLocaleString()} XAF</p>
                            <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                    </div>
                     <div className="p-4 flex items-center">
                        <Button asChild variant="outline" size="icon">
                            <Link href={`/vendor/edit-product/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit {product.title}</span>
                            </Link>
                        </Button>
                    </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.images[0] || 'https://placehold.co/100x100.png'}
                            alt={product.title}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                            data-ai-hint={product.dataAiHint || "product image"}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{product.price.toLocaleString()} XAF</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="icon">
                            <Link href={`/vendor/edit-product/${product.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit {product.title}</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
