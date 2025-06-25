
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseConfigIsValid } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import type { Shop } from '@/types';
import { getMyShop } from '@/services/shopService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  isFirebaseEnabled: boolean;
  isVendor: boolean;
  shop: Shop | null;
  isShopProfileComplete: boolean;
  refetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isShopProfileComplete = (shop: Shop | null): boolean => {
  if (!shop) return false;
  // A simple check for non-empty strings and non-placeholder URLs
  return !!(shop.location && shop.logoUrl && shop.coverPhotoUrl && shop.logoUrl !== 'https://placehold.co/100x100.png' && shop.coverPhotoUrl !== 'https://placehold.co/1200x300.png');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfileAndShop = useCallback(async (user: User) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('https://e-electro-backend.onrender.com/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const profile = await response.json();
        const role = profile.role || 'customer';
        setUserRole(role);
        if (role === 'vendor') {
          const myShop = await getMyShop(user.uid, token);
          setShop(myShop);
        } else {
          setShop(null);
        }
      } else {
        const errorText = await response.text();
        console.error(`Failed to fetch user profile. Status: ${response.status}. Body: ${errorText}`);
        setUserRole('customer');
        setShop(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserRole('customer');
      setShop(null);
    }
  }, []);

  useEffect(() => {
    if (!firebaseConfigIsValid || !auth) {
      if (!firebaseConfigIsValid) {
        console.warn("Firebase configuration is missing or incomplete in .env file. Authentication will be disabled.");
      }
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfileAndShop(currentUser);
      } else {
        setUserRole(null);
        setShop(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchProfileAndShop]);

  const refetchUserProfile = useCallback(async () => {
    if (auth?.currentUser) {
      setLoading(true);
      await fetchProfileAndShop(auth.currentUser);
      setLoading(false);
    }
  }, [fetchProfileAndShop]);

  const isVendor = userRole === 'vendor';

  useEffect(() => {
    const isVendorRoute = pathname.startsWith('/vendor/');
    if (!loading && userRole === 'vendor' && shop && !isShopProfileComplete(shop) && isVendorRoute && pathname !== '/vendor/update-shop') {
       if (shop.approved) { // Only redirect if shop is approved but profile is incomplete
         router.push('/vendor/update-shop');
       }
    }
  }, [loading, userRole, shop, pathname, router]);

  const login = (email: string, pass: string) => {
    if (!firebaseConfigIsValid || !auth) {
      return Promise.reject(new Error("Firebase is not configured. Please check your .env file."));
    }
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (name: string, email: string, pass: string) => {
    if (!firebaseConfigIsValid || !auth) {
      throw new Error("Firebase is not configured. Please check your .env file.");
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const token = await userCredential.user.getIdToken();

    try {
      const response = await fetch('https://e-electro-backend.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          role: 'customer'
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            await userCredential.user.delete();
            throw new Error(errorData.message || 'Failed to register user on the backend. Please try again.');
        } else {
            await userCredential.user.delete();
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      return userCredential;
    } catch (error) {
      if (userCredential.user) {
        await userCredential.user.delete();
      }
      console.error("An error occurred during backend registration:", error);
      throw error;
    }
  };
  
  const logout = async () => {
    if (!firebaseConfigIsValid || !auth) {
      console.warn("Firebase is not configured. Logout functionality is disabled.");
      return;
    }
    await firebaseSignOut(auth);
    router.push('/');
  };

  const value = { user, loading, login, signup, logout, isFirebaseEnabled: firebaseConfigIsValid, isVendor, shop, isShopProfileComplete: isShopProfileComplete(shop), refetchUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
