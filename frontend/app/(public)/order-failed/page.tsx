import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderFailedPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <XCircle size={80} className="mx-auto text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
      <p className="text-gray-500 mb-6">
        Something went wrong with your payment. Please try again or choose Cash on Delivery.
      </p>
      <div className="flex gap-4 justify-center">
        <Button render={<Link href="/cart" />} className="bg-brand-red hover:bg-brand-red-dark">
          Try Again
        </Button>
        <Button variant="outline" render={<Link href="/shop" />}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
