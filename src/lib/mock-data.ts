
import type { Category, Order } from '@/types';

export const CATEGORIES: Category[] = ['All', 'Electronics', 'Automotive', 'Fashion', 'Toys', 'Home Goods', 'Books'];

// Note: Product data is now fetched from the API. This mock data is no longer used.

export const ORDERS: Order[] = [
  {
    id: 'order1',
    customerName: 'Alice Wonderland',
    items: [
      { productId: 'prod1', productName: 'SuperPhone X', quantity: 1, price: 799.99 },
      { productId: 'prod5', productName: 'GamerHeadset Pro', quantity: 1, price: 89.99 },
    ],
    totalAmount: 889.98,
    orderDate: '2024-07-20',
    status: 'Delivered',
    shopId: 'shop1',
  },
  {
    id: 'order2',
    customerName: 'Bob The Builder',
    items: [
      { productId: 'prod2', productName: 'UltraHD 4K TV', quantity: 1, price: 1299.00 },
    ],
    totalAmount: 1299.00,
    orderDate: '2024-07-25',
    status: 'Processing',
    shopId: 'shop2',
  },
  {
    id: 'order3',
    customerName: 'Charlie Brown',
    items: [
      { productId: 'prod3', productName: 'ProBeat Wireless Speakers', quantity: 2, price: 199.50 },
    ],
    totalAmount: 399.00,
    orderDate: '2024-07-28',
    status: 'New Inquiry',
    shopId: 'shop1', // Changed to shop1 for vendor specific view
  },
];
