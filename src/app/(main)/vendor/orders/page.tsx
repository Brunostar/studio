import { ORDERS } from '@/lib/mock-data';
import type { Order } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Simulate a logged-in vendor. In a real app, this would come from auth.
const MOCK_VENDOR_SHOP_ID = 'shop1'; 

export default function VendorOrdersPage() {
  const vendorOrders: Order[] = ORDERS.filter(order => order.shopId === MOCK_VENDOR_SHOP_ID);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline text-primary">Your Orders & Inquiries</h1>
      
      {vendorOrders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">You have no orders or inquiries yet.</p>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.toUpperCase()}</TableCell>
                  <TableCell>{order.customerName || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.items.map(item => (
                        <li key={item.productId} className="text-xs">
                          {item.productName} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'New Inquiry' ? 'default' : order.status === 'Delivered' ? 'secondary': 'outline'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
