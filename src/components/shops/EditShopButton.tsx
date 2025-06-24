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
  const { loading, user } = useAuth();

  if (loading || !user) {
    return null;
  }

  // This is the correct logic: The button should show if the logged-in user's ID
  // matches the vendorId of the shop being viewed. This allows owners to edit
  // their shop regardless of its approval status.
  if (user && shop.vendorId === user.uid) {
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
