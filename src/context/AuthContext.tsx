
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
  signInWithGoogle: () => Promise<any>;
  isFirebaseEnabled: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  shop: Shop | null;
  isShopProfileComplete: boolean;
  refetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isShopProfileComplete = (shop: Shop | null): boolean => {
  if (!shop) return false;
  // A simple check for non-empty strings and non-placeholder URLs
  return !!(shop.location && shop.logoUrl && !shop.logoUrl.includes('placehold.co') && shop.coverPhotoUrl && !shop.coverPhotoUrl.includes('placehold.co'));
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
      
      const profileResponse = await fetch(`https://batoshops.com/api/users/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error(`Failed to fetch user profile. Status: ${profileResponse.status}. Body: ${errorText}`);
        setUserRole('customer'); // Default to customer on error
        setShop(null);
        return;
      }

      const userProfile = await profileResponse.json();
      const role = userProfile.role || 'customer';
      setUserRole(role);

      if (role === 'vendor') {
        const shopData = await getMyShop(user.uid, token);
        setShop(shopData);
      } else {
        setShop(null);
      }
    } catch (error) {
      console.error("Failed to fetch user/shop data:", error);
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
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    const isVendorRoute = pathname.startsWith('/vendor/');
    
    // Redirect vendors with incomplete profiles to update their shop page
    if (!loading && isVendor && shop && !isShopProfileComplete(shop) && isVendorRoute && pathname !== '/vendor/update-shop' && pathname !== '/vendor/create-shop') {
       router.push('/vendor/update-shop');
    }
  }, [loading, isVendor, shop, pathname, router]);

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
      const response = await fetch('https://batoshops.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          role: 'customer' // All new signups start as customers
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            await userCredential.user.delete();
            throw new Error(errorData.message || 'Failed to register user on the backend. Please try again.');
        } else {
            const textError = await response.text();
            await userCredential.user.delete();
            throw new Error(`Server error: ${response.status} ${response.statusText} - ${textError}`);
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

  const signInWithGoogle = async () => {
    if (!firebaseConfigIsValid || !auth) {
      throw new Error("Firebase is not configured. Please check your .env file.");
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const profileResponse = await fetch(`https://batoshops.com/api/users/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (profileResponse.status === 404) {
        const registrationResponse = await fetch('https://batoshops.com/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: user.displayName || user.email,
            email: user.email,
            role: 'customer'
          })
        });

        if (!registrationResponse.ok) {
          const errorData = await registrationResponse.json();
          await firebaseSignOut(auth);
          throw new Error(errorData.message || 'Backend registration failed after Google Sign-In.');
        }
      } else if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        await firebaseSignOut(auth);
        throw new Error(`Failed to verify user profile on backend: ${errorText}`);
      }

      return result;
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      throw new Error(error.message || 'An unexpected error occurred during Google Sign-In.');
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

  const value = { user, loading, login, signup, logout, signInWithGoogle, isFirebaseEnabled: firebaseConfigIsValid, isVendor, isAdmin, shop, isShopProfileComplete: isShopProfileComplete(shop), refetchUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
