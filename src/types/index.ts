

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  shopId: string;
  category: string;
  subCategory: string;
  manufacturer?: string;
  features?: { name: string; value: string }[];
  vendorId: string;
  createdAt: string;
  isPopular?: boolean;
  dataAiHint?: string; // For placeholder images
}

export interface Shop {
  id: string;
  name:string;
  description: string;
  whatsappNumber: string;
  location?: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  isFeatured?: boolean;
  dataAiHintCoverPhoto?: string;
  dataAiHintLogo?: string;
  vendorId: string; // The ID of the user who owns the shop
  approved?: boolean; // Is the shop approved by an admin
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number; // Price at the time of order
}

export interface Order {
  id: string;
  customerName?: string; // Simplified for now
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: 'New Inquiry' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shopId: string;
}

export type Category = string;

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'customer';
}
