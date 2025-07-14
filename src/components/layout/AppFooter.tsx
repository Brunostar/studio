'use client';

import { useState, useEffect } from 'react';

export function AppFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 md:py-0 border-t border-border/40">
      <div className="container mx-auto px-4 flex h-24 items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {currentYear} Bato. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
