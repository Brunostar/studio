
import type { Product } from '@/types';

const API_BASE_URL = 'https://e-electro-backend.onrender.com/api';

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Using 'no-cache' to ensure we always get the freshest product list
    const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch products, status:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  // The provided backend doesn't have a direct GET /products/:id endpoint.
  // This implementation fetches all products and finds the one with the matching ID.
  // This is not efficient for a large number of products.
  // A dedicated API endpoint would be a better long-term solution.
  try {
    const products = await getAllProducts();
    return products.find(p => p.id === productId) || null;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

export async function getProductsByShopId(shopId: string): Promise<Product[]> {
  // The backend endpoint for this seems to be causing a 500 error.
  // As a robust fallback, this implementation fetches all products and filters
  // them by vendorId on the client-side. This is inefficient for a large number
  // of products, but it avoids the server error.
  try {
    const allProducts = await getAllProducts();
    // The shopId passed here is the vendorId
    return allProducts.filter(product => product.vendorId === shopId);
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
}
