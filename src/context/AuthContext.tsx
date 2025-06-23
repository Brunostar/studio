'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseConfigIsValid } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  isFirebaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!firebaseConfigIsValid || !auth) {
      if (!firebaseConfigIsValid) {
        console.warn("Firebase configuration is missing or incomplete in .env file. Authentication will be disabled.");
      }
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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

  const signup = (email: string, pass: string) => {
    if (!firebaseConfigIsValid || !auth) {
      return Promise.reject(new Error("Firebase is not configured. Please check your .env file."));
    }
    return createUserWithEmailAndPassword(auth, email, pass);
  };
  
  const logout = async () => {
    if (!firebaseConfigIsValid || !auth) {
      console.warn("Firebase is not configured. Logout functionality is disabled.");
      return;
    }
    await firebaseSignOut(auth);
    router.push('/');
  };

  const value = { user, loading, login, signup, logout, isFirebaseEnabled: firebaseConfigIsValid };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
