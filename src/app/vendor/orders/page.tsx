'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ORDERS } from '@/lib/mock-data';
import type { Order } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Lock } from 'lucide-react';


export default function VendorOrdersPage() {
  const { user, loading, isVendor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">Your Orders & Inquiries</h1>
        <Skeleton className="h-96 w-full" />
      </div>
    )
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
            <CardDescription>You must be a vendor to access this page. You can create a shop to become a vendor.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  // In a real app, you would fetch orders belonging to this specific vendor.
  // For now, we are showing all mock orders as an example.
  const vendorOrders: Order[] = ORDERS; 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">Your Orders & Inquiries</h1>
      
      {vendorOrders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">You have no orders or inquiries yet.</p>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {vendorOrders.map((order) => (
                <Card key={order.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-lg">{order.id.toUpperCase()}</CardTitle>
                                <CardDescription>{new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                             </div>
                             <Badge variant={order.status === 'New Inquiry' ? 'default' : order.status === 'Delivered' ? 'secondary': 'outline'}>
                                {order.status}
                             </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <p className="font-medium">{order.customerName}</p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2">
                                {order.items.map(item => (
                                    <li key={item.productId} className="text-xs">
                                    {item.productName} (x{item.quantity})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <p className="font-semibold text-primary w-full text-right">Total: {order.totalAmount.toLocaleString()} XAF</p>
                    </CardFooter>
                </Card>
            ))}
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-lg border shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {vendorOrders.map((order) => (
                    <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.toUpperCase()}</TableCell>
                    <TableCell>{order.customerName || 'N/A'}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <ul className="list-disc list-inside">
                        {order.items.map(item => (
                            <li key={item.productId} className="text-xs">
                            {item.productName} (x{item.quantity})
                            </li>
                        ))}
                        </ul>
                    </TableCell>
                    <TableCell>{order.totalAmount.toLocaleString()} XAF</TableCell>
                    <TableCell>
                        <Badge variant={order.status === 'New Inquiry' ? 'default' : order.status === 'Delivered' ? 'secondary': 'outline'}>
                        {order.status}
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
