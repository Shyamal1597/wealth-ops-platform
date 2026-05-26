'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { HOME_BANNERS } from '@/lib/constants';

export function MarqueeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HOME_BANNERS.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[250px] md:h-[325px] relative overflow-hidden bg-gray-900">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={HOME_BANNERS[currentIndex]}
          alt={`Banner ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
      </div>

      {/* Overlay for better text visibility if needed */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Navigation dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {HOME_BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-7'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
