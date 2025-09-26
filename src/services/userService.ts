

import type { UserProfile } from '@/types';

const API_BASE_URL = 'https://e-electro-backend.onrender.com/api';

export async function getAllUsers(token: string): Promise<UserProfile[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    } catch (e) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
  }
  return res.json();
}

export async function setUserRole(uid: string, role: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/users/set-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ uid, role }),
  });

  if (!res.ok) {
    try {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to set role for user ${uid}`);
    } catch (e) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
  }
}
