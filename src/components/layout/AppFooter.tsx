'use client';

import { useState, useEffect } from 'react';

export function AppFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row md:justify-between">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} Bato. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
