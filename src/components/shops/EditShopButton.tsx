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
  const { loading, isVendor, shop: myShop } = useAuth();

  if (loading) {
    return null; // Or a skeleton
  }

  // Show button if the logged-in user is a vendor and the shop on the page is their own
  if (isVendor && myShop && shop.id === myShop.id) {
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
