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
  const { loading, user, isVendor } = useAuth();

  if (loading) {
    return null;
  }

  // This is the most reliable check:
  // 1. Is the user a vendor?
  // 2. Is there a logged-in user object?
  // 3. Does the logged-in user's ID match the shop's owner ID (`vendorId`)?
  if (isVendor && user && shop.vendorId === user.uid) {
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
