'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { UserNav } from './UserNav';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export function AuthStatus() {
  const { user, loading, isFirebaseEnabled } = useAuth();
  
  // In a real app, we'd check if the user actually owns a shop from a database
  const userHasShop = false; 

  if (!isFirebaseEnabled) {
    return (
      <Alert variant="destructive" className="max-w-xs text-xs p-2">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="text-xs font-bold">Action Required</AlertTitle>
        <AlertDescription>
          Firebase not configured. Please update <b>.env</b> file.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return <Skeleton className="h-9 w-44" />;
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          {!userHasShop && (
            <Button asChild variant="outline" size="sm">
              <Link href="/vendor/create-shop">Create Shop</Link>
            </Button>
          )}
          <UserNav />
        </>
      ) : (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  );
}
