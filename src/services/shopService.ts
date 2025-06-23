import type { Shop } from '@/types';

const API_BASE_URL = 'https://e-electro-backend.onrender.com/api';

export async function getAllShops(): Promise<Shop[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/shops`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error('Failed to fetch shops, status:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
}

export async function getShopById(shopId: string): Promise<Shop | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/shops/${shopId}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch shop ${shopId}, status:`, res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching shop ${shopId}:`, error);
    return null;
  }
}
