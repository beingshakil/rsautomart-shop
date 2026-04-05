'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-6"><Skeleton className="h-64 w-full" /></div>;
  if (!order) return <div className="container mx-auto px-4 py-20 text-center text-gray-500">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
        <Badge>{order.orderStatus}</Badge>
      </div>

      {/* Items */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.image && <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm">x{item.quantity}</p>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Shipping */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <div className="text-sm space-y-1 text-gray-600">
            <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.area}, {order.shippingAddress.district}</p>
            <p>{order.shippingAddress.division}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-brand-red">{formatPrice(order.totalAmount)}</span></div>
          </div>
          <div className="mt-4 text-sm space-y-1 text-gray-600">
            <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
            {order.trackingId && <p>Tracking: {order.trackingId}</p>}
            <p>Ordered: {new Date(order.createdAt).toLocaleDateString('en-BD')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
