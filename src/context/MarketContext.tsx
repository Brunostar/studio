'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Category } from '@/types';

interface MarketContextType {
  selectedMarket: Category | null;
  setSelectedMarket: (market: Category | null) => void;
  isMarketLoading: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const MARKET_STORAGE_KEY = 'cameroonMarket.selectedMarket';

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMarket, setSelectedMarketState] = useState<Category | null>(null);
  const [isMarketLoading, setIsMarketLoading] = useState(true);

  useEffect(() => {
    try {
      const storedMarket = localStorage.getItem(MARKET_STORAGE_KEY);
      if (storedMarket) {
        setSelectedMarketState(JSON.parse(storedMarket));
      }
    } catch (error) {
      console.error("Failed to parse selected market from localStorage", error);
      localStorage.removeItem(MARKET_STORAGE_KEY);
    } finally {
        setIsMarketLoading(false);
    }
  }, []);

  const setSelectedMarket = useCallback((market: Category | null) => {
    setSelectedMarketState(market);
    if (typeof window !== 'undefined') {
        if (market) {
            localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(market));
        } else {
            localStorage.removeItem(MARKET_STORAGE_KEY);
        }
    }
  }, []);

  const value = { selectedMarket, setSelectedMarket, isMarketLoading };

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
