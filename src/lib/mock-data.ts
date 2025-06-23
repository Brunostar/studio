import type { Product, Shop, Category, Order } from '@/types';

export const CATEGORIES: Category[] = ['All', 'Phones', 'TVs', 'Speakers', 'Laptops', 'Accessories'];

export const SHOPS: Shop[] = [
  {
    id: 'shop1',
    name: 'Gadget Galaxy',
    description: 'Your one-stop shop for the latest and greatest gadgets. We offer a wide variety of electronics from top brands.',
    bannerUrl: 'https://placehold.co/1200x300.png',
    dataAiHintBanner: 'tech store banner',
    logoUrl: 'https://placehold.co/100x100.png',
    dataAiHintLogo: 'store logo',
    vendorWhatsapp: '12345678901', // Replace with a valid WhatsApp number format if testing
    isFeatured: true,
    userId: 'mock-user-id-1', // Example owner
  },
  {
    id: 'shop2',
    name: 'Electro Dreams',
    description: 'Bringing you the future of electronics today. Quality products and excellent customer service.',
    bannerUrl: 'https://placehold.co/1200x300.png',
    dataAiHintBanner: 'electronics shop',
    logoUrl: 'https://placehold.co/100x100.png',
    dataAiHintLogo: 'company logo',
    vendorWhatsapp: '12345678902',
  },
  {
    id: 'shop3',
    name: 'Sound & Vision Hub',
    description: 'Specialists in high-fidelity audio and stunning visual displays. Experience entertainment like never before.',
    bannerUrl: 'https://placehold.co/1200x300.png',
    dataAiHintBanner: 'audio visual',
    logoUrl: 'https://placehold.co/100x100.png',
    dataAiHintLogo: 'brand monogram',
    vendorWhatsapp: '12345678903',
    isFeatured: true,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'SuperPhone X',
    description: 'The latest smartphone with AI capabilities and a stunning display.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'smartphone',
    price: 799.99,
    stockCount: 15,
    shopId: 'shop1',
    category: 'Phones',
    isPopular: true,
  },
  {
    id: 'prod2',
    name: 'UltraHD 4K TV',
    description: 'Experience breathtaking visuals with this 55-inch 4K TV.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'television screen',
    price: 1299.00,
    stockCount: 8,
    shopId: 'shop2',
    category: 'TVs',
    isPopular: true,
  },
  {
    id: 'prod3',
    name: 'ProBeat Wireless Speakers',
    description: 'Immersive sound quality in a sleek, portable design.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'wireless speaker',
    price: 199.50,
    stockCount: 25,
    shopId: 'shop3',
    category: 'Speakers',
  },
  {
    id: 'prod4',
    name: 'WorkPro Laptop',
    description: 'Powerful and lightweight laptop for professionals on the go.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'laptop computer',
    price: 999.00,
    stockCount: 5,
    shopId: 'shop1',
    category: 'Laptops',
    isPopular: true,
  },
  {
    id: 'prod5',
    name: 'GamerHeadset Pro',
    description: 'Crystal clear audio and comfort for long gaming sessions.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'gaming headset',
    price: 89.99,
    stockCount: 30,
    shopId: 'shop2',
    category: 'Accessories',
  },
  {
    id: 'prod6',
    name: 'SmartCam 360',
    description: 'Secure your home with this intelligent 360-degree camera.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'security camera',
    price: 129.00,
    stockCount: 0, // Out of stock example
    shopId: 'shop3',
    category: 'Accessories',
  },
   {
    id: 'prod7',
    name: 'TabletMax 10',
    description: 'A versatile 10-inch tablet perfect for work and play.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'tablet device',
    price: 349.99,
    stockCount: 12,
    shopId: 'shop1',
    category: 'Laptops', // Or a new 'Tablets' category
  },
  {
    id: 'prod8',
    name: 'SoundBar Ultimate',
    description: 'Elevate your TV audio experience with this powerful soundbar.',
    images: ['https://placehold.co/600x600.png'],
    dataAiHint: 'soundbar audio',
    price: 299.00,
    stockCount: 7,
    shopId: 'shop3',
    category: 'Speakers',
    isPopular: true,
  },
];

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
