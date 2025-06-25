
'use client';

import { useAuth } from '@/context/AuthContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { AdminNav } from '@/components/admin/AdminNav';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAdmin } = useAuth();

  if (loading) {
      return (
          <div className="flex flex-col min-h-screen">
              <AppHeader />
              <main className="flex-1 py-8">
                  <div className="container mx-auto px-4">
                      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                          <aside className="lg:w-1/5">
                            <div className="flex flex-col space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                          </aside>
                          <div className="flex-1"><Skeleton className="h-96 w-full" /></div>
                      </div>
                  </div>
              </main>
              <AppFooter />
          </div>
      )
  }

  if (!isAdmin) {
      return (
          <div className="flex flex-col min-h-screen">
            <AppHeader />
             <main className="flex-1 py-8">
                <div className="container mx-auto px-4 flex items-center justify-center">
                    <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                        <Lock className="h-5 w-5" />
                        Access Denied
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You must be an administrator to access this page.</p>
                    </CardContent>
                    </Card>
                </div>
            </main>
            <AppFooter />
          </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <AdminNav />
                </aside>
                <div className="flex-1">{children}</div>
            </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
