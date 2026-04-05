'use client';

import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';

export default function OffersPage() {
  const { products, loading } = useFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-brand-red to-brand-red-dark rounded-xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Offers & Deals</h1>
        <p className="text-lg opacity-90">Grab the best deals before they&apos;re gone!</p>
      </div>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
