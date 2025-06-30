'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { approveShop } from '@/services/shopService';
import { setUserRole } from '@/services/userService';
import type { Shop } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ShopApprovalListProps {
  initialShops: Shop[];
}

export function ShopApprovalList({ initialShops }: ShopApprovalListProps) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleApprove = async (shopToApprove: Shop) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    setLoadingStates(prev => ({ ...prev, [shopToApprove.id]: true }));

    try {
      const token = await user.getIdToken();
      
      // Step 1: Approve the shop
      await approveShop(shopToApprove.id, token);
      
      // Step 2: Set the user's role to 'vendor'
      await setUserRole(shopToApprove.vendorId, 'vendor', token);

      toast({
        title: "Shop Approved!",
        description: `${shopToApprove.name} is now active and the owner is a vendor.`,
      });

      // Optimistically update the UI
      setShops(prevShops => prevShops.map(s => 
        s.id === shopToApprove.id ? { ...s, approved: true } : s
      ));
      
      // Optional: Or refetch data from server
      // router.refresh();

    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [shopToApprove.id]: false }));
    }
  };
  
  if (shops.length === 0) {
      return (
          <p className="text-center text-muted-foreground py-8">No shops found.</p>
      )
  }

  return (
    <>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {shops.map((shop) => (
                <Card key={shop.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                             <Link href={`/shops/${shop.id}`} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                <CardTitle className="text-lg">{shop.name}</CardTitle>
                             </Link>
                             <Badge variant={shop.approved ? "secondary" : "destructive"} className="flex-shrink-0">
                                {shop.approved ? "Approved" : "Pending"}
                             </Badge>
                        </div>
                        <CardDescription className="font-mono text-xs !mt-2">Vendor ID: {shop.vendorId}</CardDescription>
                    </CardHeader>
                    {!shop.approved && (
                        <CardContent>
                             <Button
                                size="sm"
                                className="w-full"
                                onClick={() => handleApprove(shop)}
                                disabled={loadingStates[shop.id]}
                                >
                                {loadingStates[shop.id] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Approve Shop
                            </Button>
                        </CardContent>
                    )}
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
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shops.map((shop) => (
                    <TableRow key={shop.id}>
                        <TableCell className="font-medium">
                            <Link href={`/shops/${shop.id}`} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                {shop.name}
                            </Link>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{shop.vendorId}</TableCell>
                        <TableCell>
                        <Badge variant={shop.approved ? "secondary" : "destructive"}>
                            {shop.approved ? "Approved" : "Pending Approval"}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        {!shop.approved && (
                            <Button
                            size="sm"
                            onClick={() => handleApprove(shop)}
                            disabled={loadingStates[shop.id]}
                            >
                            {loadingStates[shop.id] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Approve
                            </Button>
                        )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>
    </>
  );
}
