'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseConfigIsValid } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  isFirebaseEnabled: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!firebaseConfigIsValid || !auth) {
      if (!firebaseConfigIsValid) {
        console.warn("Firebase configuration is missing or incomplete in .env file. Authentication will be disabled.");
      }
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          // Assuming an endpoint to fetch user profile data
          const response = await fetch('https://e-electro-backend.onrender.com/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const profile = await response.json();
            // Assuming the role is returned in the profile data, e.g., { role: 'vendor' }
            setUserRole(profile.role || 'customer');
          } else {
             // Default to customer if profile not found or on error
            setUserRole('customer');
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserRole('customer'); // Default role on error
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        const errorData = await response.json();
        // If backend registration fails, delete the user from Firebase to allow a clean retry.
        await userCredential.user.delete();
        throw new Error(errorData.message || 'Failed to register user on the backend. Please try again.');
      }
      return userCredential;
    } catch (error) {
      // This catches network errors or if the backend registration fails.
      // We also delete the Firebase user here to ensure data consistency.
      if (userCredential.user) {
        await userCredential.user.delete();
      }
      console.error("An error occurred during backend registration:", error);
      throw error; // Re-throw the error to be caught by the UI
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

  const isVendor = userRole === 'vendor';

  const value = { user, loading, login, signup, logout, isFirebaseEnabled: firebaseConfigIsValid, isVendor };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
