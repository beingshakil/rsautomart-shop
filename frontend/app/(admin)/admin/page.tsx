'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/low-stock'),
    ])
      .then(([dashRes, stockRes]) => {
        setStats(dashRes.data.stats);
        setRecentOrders(dashRes.data.recentOrders);
        setLowStock(stockRes.data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'text-brand-red-dark bg-brand-red-light' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-sm text-brand-red hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0">
                      <td className="py-3">
                        <Link href={`/admin/orders/${order._id}`} className="text-brand-red hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">{order.user?.name || 'N/A'}</td>
                      <td className="py-3 font-medium">{formatPrice(order.totalAmount)}</td>
                      <td className="py-3"><Badge variant="secondary">{order.orderStatus}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-brand-red" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-500">All products are well stocked</p>
            ) : (
              <div className="space-y-3">
                {lowStock.slice(0, 8).map((product) => (
                  <div key={product._id} className="flex items-center justify-between text-sm">
                    <span className="truncate mr-2">{product.name}</span>
                    <Badge variant="destructive">{product.stock?.quantity} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
