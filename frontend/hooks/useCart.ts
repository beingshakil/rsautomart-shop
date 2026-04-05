'use client';

import { useCartStore, CartItem } from '@/store/cartStore';
import { toast } from 'sonner';

export function useCart() {
  const { items, totalAmount, addItem, removeItem, updateQuantity, clearCart, getItemCount } =
    useCartStore();

  const addToCart = (product: any, quantity = 1, variant?: string) => {
    if (product.stock?.status === 'out_of_stock') {
      toast.error('Product is out of stock');
      return;
    }

    const price = product.discountPrice || product.price;
    const item: CartItem = {
      _id: product._id,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
      },
      quantity,
      variant,
      price,
    };

    addItem(item);
    toast.success('Added to cart');
  };

  const removeFromCart = (productId: string) => {
    removeItem(productId);
    toast.success('Removed from cart');
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    updateQuantity(productId, quantity);
  };

  return {
    items,
    totalAmount,
    itemCount: getItemCount(),
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  };
}
