
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageCarouselProps {
  images: string[];
  altText: string;
  dataAiHint?: string;
}

export function ProductImageCarousel({ images, altText, dataAiHint }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (!images || images.length === 0) {
      return (
          <div className="relative aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
             <Image
                src={'https://placehold.co/600x600.png'}
                alt="Placeholder image"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={dataAiHint || "product image"}
              />
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex]}
          alt={altText}
          fill
          className="object-cover transition-transform duration-300 ease-in-out"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={currentIndex === 0}
          key={currentIndex} // Helps with transition animations if any
          data-ai-hint={dataAiHint || "product image"}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => goToIndex(index)}
              className={cn(
                'relative aspect-square w-full rounded-md overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring',
                currentIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={src}
                alt={`${altText} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
