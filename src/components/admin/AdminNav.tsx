
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Home, LayoutDashboard, Store, Users } from 'lucide-react';

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Shop Approvals",
    href: "/admin/shops",
    icon: <Store className="mr-2 h-4 w-4" />,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
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
       <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start text-muted-foreground mt-6 border-t rounded-none pt-4"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Main Site
        </Link>
    </nav>
  );
}
