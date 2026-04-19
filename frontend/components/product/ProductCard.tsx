'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  if (!product) return null;
  const { addToCart } = useCart();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWished = isInWishlist(product._id);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  const toggleWishlist = () => {
    if (isWished) {
      removeItem(product._id);
    } else {
      addItem({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full">
      {/* Image */}
      <div className="relative bg-gray-100 overflow-hidden aspect-square animate-pulse group-hover:animate-none">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500 opacity-0"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                img.classList.remove('opacity-0');
                const parent = img.parentElement?.parentElement;
                if (parent) parent.classList.remove('animate-pulse');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50">
              No Image
            </div>
          )}
        </Link>

        {/* Discount Badge – Top Right (pill) */}
        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 bg-brand-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            -{getDiscountPercent(product.price, product.discountPrice)}%
          </span>
        )}

        {/* Hover Action Icons – Top Left (slide in from left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-2 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-brand-red hover:bg-gray-50 transition-colors"
            title="Quick View"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {product.category?.name && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.category.name}</p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-brand-black leading-snug line-clamp-2 mb-2 hover:text-brand-red transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="text-brand-red font-bold text-lg">{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-gray-400 text-sm line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Bottom: Wishlist + Add to Cart */}
        <div className="flex items-stretch gap-1.5 sm:gap-2 border-t border-gray-100 pt-2.5 sm:pt-3">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label="Add to Wishlist"
            title="Add to Wishlist"
            className={`shrink-0 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center border rounded-md transition-colors ${
              isWished
                ? 'border-brand-red text-brand-red bg-red-50'
                : 'border-gray-200 text-gray-600 hover:text-brand-red hover:border-brand-red hover:bg-gray-50'
            }`}
          >
            <Heart size={16} className={isWished ? 'fill-brand-red' : ''} />
          </button>
          {/* Add to Cart Button */}
          <button
            onClick={() => {
              if (product.stock?.status !== 'out_of_stock') {
                addToCart(product, 1);
              }
            }}
            disabled={product.stock?.status === 'out_of_stock'}
            className="flex-1 min-h-9 sm:min-h-11 bg-brand-black hover:bg-brand-red text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1 sm:gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={12} />
            <span className="hidden sm:inline">{product.stock?.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}</span>
            <span className="sm:hidden">{product.stock?.status === 'out_of_stock' ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
