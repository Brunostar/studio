
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ListChecks, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce platform.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/admin/shops">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Shop Approvals</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Approve new vendor shops.</p>
            </CardContent>
          </Link>
        </Card>
         <Card className="hover:shadow-lg transition-shadow">
           <Link href="/admin/users">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">User Management</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View and manage platform users.</p>
            </CardContent>
           </Link>
        </Card>
      </div>
    </div>
  );
}
