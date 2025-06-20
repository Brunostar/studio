export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  stockCount: number;
  shopId: string;
  category: string;
  isPopular?: boolean;
  dataAiHint?: string; // For placeholder images
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  logoUrl: string;
  vendorWhatsapp: string;
  isFeatured?: boolean;
  dataAiHintBanner?: string;
  dataAiHintLogo?: string;
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
