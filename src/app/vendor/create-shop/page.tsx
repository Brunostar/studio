'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const createShopFormSchema = z.object({
  name: z.string().min(3, { message: 'Shop name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  vendorWhatsapp: z.string().min(10, { message: 'Please enter a valid WhatsApp number including country code.' }).startsWith('+', {message: 'WhatsApp number must start with a country code (e.g., +1...)'}),
});

type CreateShopFormValues = z.infer<typeof createShopFormSchema>;

export default function CreateShopPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast({ title: 'Please log in to create a shop.', variant: 'destructive' });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  const form = useForm<CreateShopFormValues>({
    resolver: zodResolver(createShopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      vendorWhatsapp: '',
    },
  });

  async function onSubmit(data: CreateShopFormValues) {
    if (!user) {
      toast({ title: 'You must be logged in to create a shop.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://e-electro-backend.onrender.com/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          whatsappNumber: data.vendorWhatsapp,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create shop. Please try again.');
      }

      toast({
        title: 'Shop Submitted for Review!',
        description: `Thank you! Your shop "${data.name}" has been submitted and is pending activation by an administrator.`,
      });
      
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Shop Creation Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
             <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Shop</CardTitle>
          <CardDescription>Fill in the details below to set up your new e-commerce store. Your shop will be reviewed by an admin before activation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Gadget Grove" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell customers what makes your shop special."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="vendorWhatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Review
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
