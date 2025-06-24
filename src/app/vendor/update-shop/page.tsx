
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getMyShop, updateShop } from '@/services/shopService';
import type { Shop } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const updateShopFormSchema = z.object({
  name: z.string().min(3, { message: 'Shop name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  whatsappNumber: z.string().min(10, 'Please enter a valid WhatsApp number.'),
  location: z.string().min(3, 'Please enter a valid location.'),
  logoUrl: z.string().url('Please enter a valid URL for the logo.'),
  coverPhotoUrl: z.string().url('Please enter a valid URL for the cover photo.'),
});

type UpdateShopFormValues = z.infer<typeof updateShopFormSchema>;

export default function UpdateShopPage() {
  const router = useRouter();
  const { user, loading: authLoading, refetchUserProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageShop, setPageShop] = useState<Shop | null>(null);
  const [isFetchingPageData, setIsFetchingPageData] = useState(true);

  const form = useForm<UpdateShopFormValues>({
    resolver: zodResolver(updateShopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      whatsappNumber: '',
      location: '',
      logoUrl: '',
      coverPhotoUrl: '',
    },
  });

  useEffect(() => {
    // This effect fetches the shop data specifically for this page.
    const fetchPageData = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const shopData = await getMyShop(user.uid, token);
          setPageShop(shopData);
        } catch (error) {
          console.error("Failed to fetch shop data for update page", error);
          setPageShop(null);
        } finally {
          setIsFetchingPageData(false);
        }
      }
    };
  
    if (!authLoading) {
      if (user) {
        fetchPageData();
      } else {
        // No user is logged in, redirect them.
        router.push('/login');
      }
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    // This effect populates the form once we have the page-specific shop data.
    if (pageShop) {
      form.reset({
        name: pageShop.name || '',
        description: pageShop.description || '',
        whatsappNumber: pageShop.whatsappNumber || '',
        location: pageShop.location || '',
        logoUrl: pageShop.logoUrl || '',
        coverPhotoUrl: pageShop.coverPhotoUrl || '',
      });
    }
  }, [pageShop, form]);

  async function onSubmit(data: UpdateShopFormValues) {
    if (!user || !pageShop) {
      toast({ title: 'Authentication error. Please log in again.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await updateShop(pageShop.id, data, token);

      // Refresh the user profile in the context to get the latest shop data for other pages.
      await refetchUserProfile();

      toast({
        title: 'Shop Updated!',
        description: 'Your shop information has been successfully updated.',
      });
      
      router.push(`/shops/${pageShop.id}`);
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show a skeleton loader while the auth context is loading OR we are fetching data for this page.
  if (authLoading || isFetchingPageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If, after all loading, we still don't have shop data, the user can't edit anything.
  if (!pageShop) {
    return (
       <div className="container mx-auto px-4 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)'}}>
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Shop Not Found</CardTitle>
            <CardDescription>
              We couldn't find your shop details. You might need to create one first.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/vendor/create-shop">Create Your Shop</Link>
              </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If all checks pass, render the form.
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Update Your Shop</CardTitle>
          <CardDescription>
            { !pageShop.location ? 'Your shop is almost ready! Please complete your profile to make it visible to customers.' : 'Edit your shop information below.' }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Shop Name</FormLabel><FormControl><Input placeholder="e.g., The Gadget Grove" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Shop Description</FormLabel><FormControl><Textarea placeholder="Tell customers about your shop." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="whatsappNumber" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="location" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Silicon Valley, CA" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="logoUrl" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Logo URL</FormLabel><FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="coverPhotoUrl" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Cover Photo URL</FormLabel><FormControl><Input placeholder="https://example.com/cover.png" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
