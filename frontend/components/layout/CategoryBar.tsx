'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { dummyCategories } from '@/lib/dummyData';

export default function CategoryBar() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.categories))
      .catch(() => setCategories(dummyCategories));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="bg-brand-black overflow-x-auto scrollbar-hide">
      <div className="max-w-360 mx-auto px-4 flex items-center gap-0">
        <Link
          href="/shop"
          className="flex items-center gap-2 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-brand-red-dark transition-colors flex-shrink-0"
        >
          All Categories
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/shop/${cat.slug}`}
            className="text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider px-4 py-3 transition-colors flex-shrink-0 hover:bg-white/5"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
