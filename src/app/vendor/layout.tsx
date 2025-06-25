
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { VendorNav } from '@/components/layout/VendorNav';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <VendorNav />
                </aside>
                <div className="flex-1">{children}</div>
            </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
