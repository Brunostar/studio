
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Home, LayoutDashboard, ListOrdered, Package, Settings, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/vendor/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: <Package className="mr-2 h-4 w-4" />,
  },
  {
    title: "Orders & Inquiries",
    href: "/vendor/orders",
    icon: <ListOrdered className="mr-2 h-4 w-4" />,
  },
  {
    title: "Shop Settings",
    href: "/vendor/update-shop",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

export function VendorNav() {
  const pathname = usePathname();
  const { shop } = useAuth();

  return (
    <nav className="flex flex-col space-y-2">
      {shop && (
        <Link
          href={`/shops/${shop.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "justify-start font-semibold mb-2"
          )}
        >
          <Store className="mr-2 h-4 w-4" />
          View Public Shop
        </Link>
      )}
      
      <div className="flex flex-col space-y-1">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted font-semibold"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
       <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start text-muted-foreground mt-6 border-t rounded-none pt-4"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Switch to Customer View
        </Link>
    </nav>
  );
}
