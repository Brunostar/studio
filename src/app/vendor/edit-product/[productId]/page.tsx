
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getProductById, updateProduct } from '@/services/productService';
import type { Product } from '@/types';
import { storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { MARKET_CATEGORIES } from '@/lib/mock-data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const editProductFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }),
  subCategory: z.string().min(1, { message: "Please select a sub-category." }),
  images: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`),
});

type EditProductFormValues = z.infer<typeof editProductFormSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading, isVendor } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isFetchingProduct, setIsFetchingProduct] = useState(true);

  const productId = params.productId as string;

  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      subCategory: '',
      images: undefined,
    },
  });

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setIsFetchingProduct(true);
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          form.reset({
            title: fetchedProduct.title,
            description: fetchedProduct.description,
            price: fetchedProduct.price,
            stock: fetchedProduct.stock,
            subCategory: fetchedProduct.subCategory,
          });
        } else {
          toast({ title: "Product not found", description: "Could not find the product you're trying to edit.", variant: "destructive" });
          router.push('/vendor/products');
        }
        setIsFetchingProduct(false);
      };
      fetchProduct();
    }
  }, [productId, form, router, toast]);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!storage) throw new Error("Firebase Storage not configured.");
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytesResumable(fileRef, file);
    return getDownloadURL(snapshot.ref);
  };

  async function onSubmit(data: EditProductFormValues) {
    if (!user || !product) {
      toast({ title: 'An error occurred. Please try again.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      let imageUrls: string[] | undefined = undefined;

      if (data.images && data.images.length > 0) {
        toast({ title: 'Uploading new images...', description: 'Please wait, this may take a moment.' });
        const imageFiles = Array.from(data.images as FileList);
        imageUrls = await Promise.all(
          imageFiles.map((file, index) => {
            const productPath = `products/${user.uid}/${Date.now()}-${index}-${file.name}`;
            return uploadFile(file, productPath);
          })
        );
      }
      
      toast({ title: 'Updating product...', description: 'Finalizing product details.' });

      const updateData = {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        subCategory: data.subCategory,
        // Main category is not editable at the product level
        ...(imageUrls && { images: imageUrls }),
      };

      await updateProduct(product.id, updateData, token);

      toast({
        title: 'Product Updated!',
        description: `${data.title} has been successfully updated.`,
      });
      
      router.push('/vendor/products');

    } catch (error: any) {
      toast({
        title: 'Product Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const subCategoryOptions = product?.category ? MARKET_CATEGORIES[product.category] || [] : [];


  if (isFetchingProduct || authLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!isVendor) {
     return <p>Access Denied. You must be a vendor to edit products.</p>
  }
  
  if (!product) {
      return <p>Product could not be loaded.</p>
  }

  return (
    <div className="space-y-6">
      <Link href="/vendor/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Product</CardTitle>
          <CardDescription>Update the details for your product. Uploading new images will replace all existing ones.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Wireless Noise-Cancelling Headphones" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the product's features, benefits, and specifications." className="resize-y" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="e.g., 99.99" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
              
              <div className="space-y-2">
                 <Label>Main Category</Label>
                 <Input value={product.category || 'N/A'} disabled />
                 <p className="text-sm text-muted-foreground">The main category cannot be changed.</p>
              </div>

              <FormField control={form.control} name="subCategory" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={subCategoryOptions.length === 0}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a sub-category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategoryOptions.filter(c => c !== 'All').map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />


               <div className="space-y-2">
                <FormLabel>Current Images</FormLabel>
                <div className="flex gap-2 flex-wrap p-2 border rounded-md min-h-24">
                  {product.images.length > 0 ? product.images.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden bg-muted">
                       <Image src={url} alt={`Current image ${i+1}`} layout="fill" className="object-cover" />
                    </div>
                  )) : <p className="text-sm text-muted-foreground p-2">No current images.</p>}
                </div>
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload New Images (Optional)</FormLabel>
                  <FormControl>
                      <Input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                  </FormControl>
                  <FormDescription>Uploading new images will replace all current images.</FormDescription>
                  <FormMessage />
                </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
