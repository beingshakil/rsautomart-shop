'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminOffersPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', discountType: 'percent', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true,
  });

  const fetchCoupons = () => {
    api.get('/payment/coupons').then(({ data }) => setCoupons(data.coupons)).catch(() => {});
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxUses: Number(form.maxUses) || 0,
      };
      if (editId) {
        await api.put(`/payment/coupons/${editId}`, payload);
        toast.success('Coupon updated');
      } else {
        await api.post('/payment/coupons', payload);
        toast.success('Coupon created');
      }
      setOpen(false);
      setEditId(null);
      setForm({ code: '', discountType: 'percent', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true });
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/payment/coupons/${id}`);
      toast.success('Deleted');
      fetchCoupons();
    } catch { toast.error('Failed'); }
  };

  const startEdit = (coupon: any) => {
    setForm({
      code: coupon.code, discountType: coupon.discountType, discountValue: String(coupon.discountValue),
      minOrderAmount: String(coupon.minOrderAmount), maxUses: String(coupon.maxUses),
      expiresAt: coupon.expiresAt?.split('T')[0] || '', isActive: coupon.isActive,
    });
    setEditId(coupon._id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Offers & Coupons ({coupons.length})</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); } }}>
          <DialogTrigger render={<Button className="bg-brand-red hover:bg-brand-red-dark" />}>
            <Plus size={16} className="mr-1" /> Add Coupon
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Code *</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g., SAVE20" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <select className="w-full h-10 px-3 border rounded-md text-sm" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <Label>Value *</Label>
                  <Input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Order Amount</Label>
                  <Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
                </div>
                <div>
                  <Label>Max Uses (0 = unlimited)</Label>
                  <Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Expires At *</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark">
                {editId ? 'Update' : 'Create'} Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon._id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="text-lg font-bold text-brand-red">{coupon.code}</code>
                <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm">
                {coupon.discountType === 'percent' ? `${coupon.discountValue}% off` : `${formatPrice(coupon.discountValue)} off`}
              </p>
              <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                {coupon.minOrderAmount > 0 && <p>Min order: {formatPrice(coupon.minOrderAmount)}</p>}
                <p>Used: {coupon.usedCount}/{coupon.maxUses || '∞'}</p>
                <p>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1 mt-3">
                <Button variant="ghost" size="sm" onClick={() => startEdit(coupon)}><Edit size={14} className="mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteCoupon(coupon._id)}><Trash2 size={14} className="mr-1 text-red-500" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
