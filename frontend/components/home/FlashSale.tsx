'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap } from 'lucide-react';
import api from '@/lib/api';

export default function FlashSale() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    api.get('/flash-sale')
      .then(({ data }) => setData(data.flashSale))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data?.endDate) return;
    const endTime = new Date(data.endDate).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setData(null); // Hide section if time is up
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  if (loading) return null; // Or show skeleton
  if (!data || !data.products?.length) return null;

  const products = data.products;

  return (
    <section className="bg-linear-to-r from-brand-red to-red-700 py-14 md:py-16">
      <div className="max-w-360 mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 text-white">
            <Zap size={28} className="fill-yellow-300 text-yellow-300" />
            <h2 className="text-2xl font-bold">Flash Sale</h2>
          </div>
          <div className="flex items-center gap-2">
            {['hours', 'minutes', 'seconds'].map((unit, i) => (
              <div key={unit} className="flex items-center gap-2">
                <div className="bg-white text-red-600 rounded-lg px-3 py-2 min-w-[3rem] text-center">
                  <span className="text-xl font-bold">
                    {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] uppercase">{unit}</p>
                </div>
                {i < 2 && <span className="text-white text-xl font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mt-3" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              ))
            : products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
