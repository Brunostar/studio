

import type { Shop } from '@/types';

const API_BASE_URL = 'https://e-electro-backend.onrender.com/api';

export async function getAllShops(): Promise<Shop[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/shops`, { cache: 'no-store' }); // Use no-store to always get fresh data
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

export async function getMyShop(vendorId: string, token: string): Promise<Shop | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/shops/${vendorId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store', // Always fetch the latest shop data for the owner
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch my shop for vendor ${vendorId}, status:`, res.status);
      return null;
    }
    
    return await res.json();
    
  } catch (error) {
    console.error(`Error fetching my shop for vendor ${vendorId}:`, error);
    return null;
  }
}

export async function saveShop(shopData: Partial<Omit<Shop, 'id' | 'vendorId' | 'approved'>>, token: string): Promise<Shop> {
  const res = await fetch(`${API_BASE_URL}/shops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shopData),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to save shop.');
    } else {
      const textError = await res.text();
      throw new Error(`Server error: ${res.status} ${res.statusText} - ${textError}`);
    }
  }

  const result = await res.json();
  // The backend may return { message: "...", data: {...} }. We'll handle both cases.
  return result.data || result;
}

export async function approveShop(vendorId: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/shops/${vendorId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to approve shop.');
  }
  return res.json();
}
