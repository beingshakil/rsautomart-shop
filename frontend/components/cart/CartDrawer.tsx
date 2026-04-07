'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalAmount, removeFromCart, updateItemQuantity } = useCart();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag size={20} />
            Cart ({items.length} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <ShoppingBag size={64} className="text-gray-300" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button onClick={onClose} render={<Link href="/shop" />}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.product._id + (item.variant || '')} className="flex gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0]?.url && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="text-sm font-medium line-clamp-2 hover:text-brand-red"
                      onClick={onClose}
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                    )}
                    <p className="text-sm font-semibold text-brand-red mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateItemQuantity(item.product._id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100 active:bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateItemQuantity(item.product._id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100 active:bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        aria-label="Remove item"
                        onClick={() => removeFromCart(item.product._id)}
                        className="ml-auto w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            <div className="py-4 space-y-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-brand-red">{formatPrice(totalAmount)}</span>
              </div>
              <Button
                className="w-full bg-brand-red hover:bg-brand-red-dark"
                size="lg"
                render={<Link href="/checkout" />}
                onClick={onClose}
              >
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose} render={<Link href="/cart" />}>
                View Full Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
