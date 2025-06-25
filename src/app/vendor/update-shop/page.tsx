
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getMyShop, updateShop } from '@/services/shopService';
import type { Shop } from '@/types';
import { storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const updateShopFormSchema = z.object({
  name: z.string().min(3, { message: 'Shop name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  whatsappNumber: z.string().min(10, 'Please enter a valid WhatsApp number.'),
  location: z.string().min(3, 'Please enter a valid location.').optional(),
  logoUrl: z.any(), // Can be a string (URL) or a File object
  coverPhotoUrl: z.any(), // Can be a string (URL) or a File object
});

type UpdateShopFormValues = z.infer<typeof updateShopFormSchema>;

export default function UpdateShopPage() {
  const router = useRouter();
  const { user, loading: authLoading, refetchUserProfile, isVendor } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageShop, setPageShop] = useState<Shop | null>(null);
  const [isFetchingPageData, setIsFetchingPageData] = useState(true);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
    const fetchPageData = async () => {
      if (user) {
        setIsFetchingPageData(true);
        try {
          const token = await user.getIdToken();
          const shopData = await getMyShop(user.uid, token);
          if (shopData) {
            setPageShop(shopData);
            form.reset({
              name: shopData.name || '',
              description: shopData.description || '',
              whatsappNumber: shopData.whatsappNumber || '',
              location: shopData.location || '',
              logoUrl: shopData.logoUrl || '',
              coverPhotoUrl: shopData.coverPhotoUrl || '',
            });
            setLogoPreview(shopData.logoUrl || null);
            setCoverPreview(shopData.coverPhotoUrl || null);
          } else {
             setPageShop(null);
          }
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
        router.push('/login');
      }
    }
  }, [authLoading, user, router, form]);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!storage || !user) throw new Error("Firebase Storage or user not available.");
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytesResumable(fileRef, file);
    return getDownloadURL(snapshot.ref);
  };

  async function onSubmit(data: UpdateShopFormValues) {
    if (!user) {
      toast({ title: 'Authentication error. Please log in again.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      let finalLogoUrl = pageShop?.logoUrl || '';
      let finalCoverPhotoUrl = pageShop?.coverPhotoUrl || '';

      if (data.logoUrl instanceof File) {
        toast({ title: 'Uploading Logo...', description: 'Please wait.' });
        const logoPath = `shops/${user.uid}/logo-${Date.now()}`;
        finalLogoUrl = await uploadFile(data.logoUrl, logoPath);
      }

      if (data.coverPhotoUrl instanceof File) {
        toast({ title: 'Uploading Cover Photo...', description: 'Please wait.' });
        const coverPath = `shops/${user.uid}/cover-${Date.now()}`;
        finalCoverPhotoUrl = await uploadFile(data.coverPhotoUrl, coverPath);
      }

      const updateData = {
        name: data.name,
        description: data.description,
        whatsappNumber: data.whatsappNumber,
        location: data.location,
        logoUrl: finalLogoUrl,
        coverPhotoUrl: finalCoverPhotoUrl,
      };

      await updateShop(updateData, token);
      await refetchUserProfile();

      toast({
        title: 'Shop Updated!',
        description: 'Your shop information has been successfully updated.',
      });
      
      router.push(`/shops/${user.uid}`);
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

  if (authLoading || isFetchingPageData) {
    return (
      <Card>
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
              You must be a vendor to manage your shop settings.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }


  if (!pageShop) {
    return (
       <div className="flex items-center justify-center">
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

  return (
    <Card>
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
            
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Logo</FormLabel>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo preview" width={80} height={80} className="object-cover rounded-md aspect-square bg-muted" />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                            setLogoPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="flex-1"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverPhotoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Photo</FormLabel>
                   {coverPreview && (
                      <div className="relative w-full aspect-[2/1] mb-2">
                         <Image src={coverPreview} alt="Cover photo preview" layout="fill" className="object-cover rounded-md bg-muted" />
                      </div>
                    )}
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setCoverPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
