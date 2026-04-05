'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data.order);
        setOrderStatus(data.order.orderStatus);
        setPaymentStatus(data.order.paymentStatus);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async () => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { orderStatus, paymentStatus });
      setOrder(data.order);
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
        <Badge>{order.orderStatus}</Badge>
      </div>

      {/* Items */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-4">Items</h2>
        {order.items.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
              {item.image && <Image src={item.image} alt="" width={48} height={48} className="object-cover w-full h-full" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
            </div>
            <p className="text-sm">x{item.quantity}</p>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Shipping</h2>
          <div className="text-sm space-y-1">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.area}, {order.shippingAddress.district}</p>
            {order.deliveryNote && <p className="text-gray-500 mt-2">Note: {order.deliveryNote}</p>}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <Separator />
            <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
            <p className="text-gray-500">Payment: {order.paymentMethod}</p>
            {order.couponCode && <p className="text-gray-500">Coupon: {order.couponCode}</p>}
          </div>
        </div>
      </div>

      {/* Update Status */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Update Status</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Order Status</label>
            <select className="w-full h-10 px-3 border rounded-md text-sm mt-1" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Payment Status</label>
            <select className="w-full h-10 px-3 border rounded-md text-sm mt-1" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={updateStatus} className="bg-brand-red hover:bg-brand-red-dark">Update</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
