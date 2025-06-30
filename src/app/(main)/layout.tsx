import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <AppFooter />
      <BottomNav />
    </>
  );
}
