'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';
import { dummyCategories } from '@/lib/dummyData';

export default function CategoryBar() {
  const [categories, setCategories] = useState<any[]>([]);
  const pathname = usePathname();
  const isAllActive = pathname === '/shop';

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.categories))
      .catch(() => setCategories(dummyCategories));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="bg-brand-black relative">
      {/* Right fade hint to indicate horizontal scroll */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-brand-black to-transparent z-10 sm:hidden" />
      <div className="max-w-360 mx-auto px-4 flex items-center gap-0 overflow-x-auto scrollbar-hide">
        <Link
          href="/shop"
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-3 transition-colors shrink-0 ${
            isAllActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          All Categories
        </Link>
        {categories.map((cat) => {
          const active = pathname === `/shop/${cat.slug}`;
          return (
            <Link
              key={cat._id}
              href={`/shop/${cat.slug}`}
              className={`text-xs font-semibold uppercase tracking-wider px-4 py-3 transition-colors shrink-0 ${
                active ? 'bg-brand-red text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
