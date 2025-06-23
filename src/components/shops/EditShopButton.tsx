'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { Shop } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface EditShopButtonProps {
  shop: Shop;
}

export function EditShopButton({ shop }: EditShopButtonProps) {
  const { user, loading, isVendor } = useAuth();

  if (loading) {
    return null; // Or a skeleton
  }

  // Show button if the logged-in user is a vendor and owns this shop
  if (isVendor && user && shop.userId === user.uid) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/vendor/update-shop">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Shop
        </Link>
      </Button>
    );
  }

  return null;
}
