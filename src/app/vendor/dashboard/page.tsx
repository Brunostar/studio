
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ListOrdered, Settings, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function VendorDashboardPage() {
  const { user, loading, isVendor, shop } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!isVendor) {
    return (
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Vendor Access Only
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>This dashboard is for vendors. You can create a shop to become a vendor.</p>
          </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your shop and activities.</p>
      </div>

      {shop && !shop.approved && (
        <Alert className="border-yellow-500 text-yellow-700 [&>svg]:text-yellow-500">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Shop Pending Approval</AlertTitle>
          <AlertDescription>
            Your shop is currently under review by an administrator. You can update your shop settings, but you won't be able to add products until it's approved.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/vendor/products">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Manage Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Add, edit, or view your shop's products.</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/vendor/orders">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">View Orders & Inquiries</CardTitle>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Check your customer orders and inquiries.</p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/vendor/update-shop">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Shop Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Update your shop profile and details.</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
