
import { getAllShops } from '@/services/shopService';
import { ShopApprovalList } from '@/components/admin/ShopApprovalList';

export default async function AdminShopsPage() {
  // Fetch all shops on the server to be passed to the client component
  const shops = await getAllShops();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">Shop Approvals</h1>
        <p className="text-muted-foreground">Review and approve new vendor shops.</p>
      </div>
      <ShopApprovalList initialShops={shops} />
    </div>
  );
}
