'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Shop } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, PlusCircle, Share2 } from 'lucide-react';
import { ShareShopDialog } from './ShareShopDialog';

interface ShopOwnerActionsProps {
  shop: Shop;
}

export function ShopOwnerActions({ shop }: ShopOwnerActionsProps) {
  const { loading, user } = useAuth();
  const [shopUrl, setShopUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShopUrl(window.location.href);
    }
  }, []);

  if (loading || !user) {
    return null;
  }

  // The buttons should show if the logged-in user's ID
  // matches the vendorId of the shop being viewed.
  if (user && shop.vendorId === user.uid) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <ShareShopDialog shopUrl={shopUrl}>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </ShareShopDialog>
        <Button asChild variant="outline" size="sm">
          <Link href="/vendor/update-shop">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Shop
          </Link>
        </Button>
        <Button asChild variant="default" size="sm">
          <Link href="/vendor/add-product">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
    );
  }

  return null;
}
