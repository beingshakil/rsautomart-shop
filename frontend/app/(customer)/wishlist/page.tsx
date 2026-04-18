'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Save items you love for later</p>
        <Button render={<Link href="/shop" />} className="bg-brand-red hover:bg-brand-red-dark">
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length} items)</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          if (!item) return null;
          return (
          <div key={item._id} className="border rounded-lg overflow-hidden bg-white">
            <Link href={`/product/${item.slug}`} className="block aspect-square relative bg-gray-100">
              {item.images?.[0]?.url && (
                <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
              )}
            </Link>
            <div className="p-3">
              <Link href={`/product/${item.slug}`} className="text-sm font-medium line-clamp-2 hover:text-brand-red">
                {item.name}
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-brand-red">{formatPrice(item.discountPrice || item.price)}</span>
                {item.discountPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(item.price)}</span>}
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="flex-1 bg-brand-red hover:bg-brand-red-dark"
                  onClick={() => {
                    addToCart({ _id: item._id, name: item.name, slug: item.slug, price: item.price, discountPrice: item.discountPrice, images: item.images, stock: { status: 'in_stock', quantity: 10 } });
                    removeItem(item._id);
                  }}
                >
                  <ShoppingCart size={14} className="mr-1" /> Add to Cart
                </Button>
                <Button size="sm" variant="outline" onClick={() => removeItem(item._id)}>
                  <Heart size={14} className="fill-red-500 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
