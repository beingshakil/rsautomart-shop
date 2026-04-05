'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-2">Thank you for your order. We will process it shortly.</p>
      {orderId && <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>}
      <div className="flex gap-4 justify-center">
        <Button render={<Link href="/orders" />} className="bg-brand-red hover:bg-brand-red-dark">
          View My Orders
        </Button>
        <Button variant="outline" render={<Link href="/shop" />}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><OrderSuccessContent /></Suspense>;
}
