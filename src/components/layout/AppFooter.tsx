
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function AppFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const whatsappNumber = '+237677704988';
  const emailAddress = 'tanjubrunostar0@gmail.com';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const emailUrl = `mailto:${emailAddress}`;

  return (
    <footer className="py-6 border-t border-border/40">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center text-sm text-muted-foreground">
            <span className="font-semibold">Contact Us:</span>
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                WhatsApp
            </Link>
            <Link href={emailUrl} className="hover:text-primary hover:underline">
                Email
            </Link>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          &copy; {currentYear} Bato. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
