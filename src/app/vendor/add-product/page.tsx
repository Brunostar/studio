

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createProduct } from '@/services/productService';
import { uploadFile } from '@/services/uploadService';
import { MARKET_CATEGORIES } from '@/lib/mock-data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Lock, Trash2, PlusCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const productFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().int().min(1, { message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock cannot be negative.' }),
  subCategory: z.string().min(1, { message: 'Please select a sub-category.' }),
  manufacturer: z.string().optional(),
  features: z.array(
    z.object({
      name: z.string().min(1, 'Feature name is required.'),
      value: z.string().min(1, 'Feature value is required.'),
    })
  ).optional(),
  images: z
    .any()
    .refine((files) => files?.length >= 1, "At least one image is required.")
    .refine((files) => Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading, isVendor, shop } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      subCategory: '',
      manufacturer: '',
      features: [],
      images: undefined,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features"
  });

  useEffect(() => {
    if (!loading && !isVendor) {
      toast({ title: 'Access Denied', description: 'You must be a vendor to add products.', variant: 'destructive' });
      router.push('/vendor/dashboard');
    }
  }, [user, loading, isVendor, router, toast]);

  async function onSubmit(data: ProductFormValues) {
    if (!user || !shop?.category) {
      toast({ title: 'You must be logged in and have a shop category defined.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      toast({ title: 'Uploading images...', description: 'Please wait, this may take a moment.' });
      
      const imageFiles = Array.from(data.images as FileList);
      const imageUrls = await Promise.all(
        imageFiles.map(file => uploadFile(file, token))
      );
      
      toast({ title: 'Creating product...', description: 'Finalizing product details.' });

      await createProduct({
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: shop.category, // Inherit from shop
        subCategory: data.subCategory,
        manufacturer: data.manufacturer,
        features: data.features,
        images: imageUrls,
      }, token);

      toast({
        title: 'Product Created!',
        description: `${data.title} has been successfully added to your shop.`,
      });
      
      router.push('/vendor/products');

    } catch (error: any) {
      toast({
        title: 'Product Creation Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (isVendor && !shop?.approved) {
    return (
       <div className="flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Shop Not Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your shop is currently pending review. You will be able to add products once your shop has been approved by an administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subCategoryOptions = shop?.category ? MARKET_CATEGORIES[shop.category] || [] : [];

  return (
    <div className="space-y-6">
      <Link href="/vendor/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Product</CardTitle>
          <CardDescription>Fill out the form below to add a new product to your shop.</CardDescription>
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

              <FormField control={form.control} name="manufacturer" render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer (Brand)</FormLabel>
                  <FormControl><Input placeholder="e.g., Samsung, Apple, Itel" {...field} /></FormControl>
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
                      <FormLabel>Price (XAF)</FormLabel>
                      <FormControl><Input type="number" step="1" placeholder="e.g., 5000" {...field} /></FormControl>
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
                 <Input value={shop?.category || 'Loading...'} disabled />
                 <p className="text-sm text-muted-foreground">The main category is inherited from your shop settings.</p>
               </div>
              
              <FormField control={form.control} name="subCategory" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={subCategoryOptions.length === 0}>
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
              
              <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Product Features</CardTitle>
                    <CardDescription>Add key-value specifications for your product. (e.g., RAM: 8GB, Color: Black).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 p-2 border rounded-md">
                      <FormField
                        control={form.control}
                        name={`features.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Feature Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Screen Size" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`features.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Feature Value</FormLabel>
                            <FormControl><Input placeholder="e.g., 6.7 inches" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ name: '', value: '' })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </CardContent>
              </Card>


              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                      <Input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Creating Product...' : 'Create Product'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
