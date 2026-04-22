'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/lib/utils';

const banners = [
  {
    badge: 'Limited Time Offer',
    title: 'MEGA AUTO\nPARTS SALE',
    subtitle: 'Premium quality parts for every make & model. Free shipping on orders over ৳999.',
    cta: 'Shop Now',
    href: '/shop',
    bg: 'from-brand-black/70 via-transparent to-brand-black/30',
    img: 'https://placehold.co/1400x450/1a1a1a/1a1a1a?text=+',
  },
  {
    badge: 'Flash Sale',
    title: 'UP TO 50%\nOFF TODAY',
    subtitle: 'Limited time deals on best-selling car & bike accessories.',
    cta: 'View Deals',
    href: '/offers',
    bg: 'from-brand-red/90 via-brand-red/60 to-brand-black/40',
    img: 'https://placehold.co/1400x450/cc0000/cc0000?text=+',
  },
  {
    badge: 'Free Delivery',
    title: 'FREE SHIPPING\nON ৳999+',
    subtitle: 'Shop more, save more. Premium accessories delivered to your doorstep.',
    cta: 'Start Shopping',
    href: '/shop',
    bg: 'from-brand-black/90 via-brand-black/50 to-brand-black/30',
    img: 'https://placehold.co/1400x450/111111/111111?text=+',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-360 mx-auto px-4 py-4">
      <div className="relative overflow-hidden rounded-lg group cursor-pointer" style={{ height: 'clamp(220px, 40vw, 450px)' }}>
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, i) => (
            <div key={i} className="w-full flex-shrink-0 relative h-full">
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden bg-brand-black">
                <Image
                  src={optimizeCloudinaryUrl(banner.img, 1400)}
                  alt={banner.title}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg}`} />
              {/* Text Content */}
              <div className="relative z-10 h-full flex items-center max-w-360 mx-auto px-6 md:px-10">
                <div className="max-w-lg">
                  <span className="inline-block bg-brand-red text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3">
                    {banner.badge}
                  </span>
                  <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight whitespace-pre-line drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base mt-2 max-w-sm drop-shadow">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.href}
                    className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-2.5 md:py-3 mt-4 md:mt-5 rounded transition-colors shadow-lg"
                  >
                    {banner.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left / Right Arrows (show on hover) */}
        <button
          onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
          className="absolute top-1/2 left-3 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-brand-red text-brand-black hover:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 backdrop-blur-sm md:opacity-70 md:group-hover:opacity-100"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrent((c) => (c + 1) % banners.length)}
          className="absolute top-1/2 right-3 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-brand-red text-brand-black hover:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 backdrop-blur-sm md:opacity-70 md:group-hover:opacity-100"
          aria-label="Next Slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-3 rounded-full transition-[width,transform,background-color] duration-300 hover:scale-125 ${
                i === current ? 'w-7 bg-white' : 'w-3 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
