import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString('en-BD')}`;
}

export function getDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case 'in_stock': return 'text-green-600';
    case 'low_stock': return 'text-orange-500';
    case 'out_of_stock': return 'text-red-600';
    default: return 'text-gray-500';
  }
}

export function getStockStatusText(status: string, quantity?: number): string {
  switch (status) {
    case 'in_stock': return 'In Stock';
    case 'low_stock': return `Only ${quantity} left!`;
    case 'out_of_stock': return 'Out of Stock';
    default: return '';
  }
}

/**
 * Optimizes Cloudinary URLs by injecting transformation parameters.
 * Default: auto-format, auto-quality, and specific width.
 */
export function optimizeCloudinaryUrl(url: string, width: number = 800): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Only apply if not already transformed
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  
  return url;
}
