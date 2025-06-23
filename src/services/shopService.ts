import type { Shop } from '@/types';

const API_BASE_URL = 'https://e-electro-backend.onrender.com/api';

export async function getAllShops(): Promise<Shop[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/shops`, { next: { revalidate: 60 } }); // Reduced revalidation time
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
    const res = await fetch(`${API_BASE_URL}/shops/${shopId}`, { next: { revalidate: 60 } });
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

export async function getMyShop(token: string): Promise<Shop | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/shops/my-shop`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store', // Always fetch the latest shop data for the owner
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error('Failed to fetch my shop, status:', res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching my shop:', error);
    return null;
  }
}

export async function updateShop(shopData: Partial<Shop>, token: string): Promise<Shop> {
  const res = await fetch(`${API_BASE_URL}/shops/my-shop`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shopData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update shop.');
  }

  return res.json();
}
