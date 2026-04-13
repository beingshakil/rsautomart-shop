'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';

export default function FlashSalePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  const [flashSale, setFlashSale] = useState({
    products: [] as string[],
    endDate: '',
    isActive: false
  });

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const { data } = await api.get('/flash-sale');
        if (data.flashSale) {
          const sale = data.flashSale;
          setFlashSale({
            products: sale.products.map((p: any) => p._id),
            endDate: sale.endDate ? new Date(sale.endDate).toISOString().slice(0, 16) : '',
            isActive: sale.isActive
          });
        }
      } catch (error) {
        toast.error('Failed to load flash sale settings');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products?limit=20&search=${search}`);
        setProducts(data.products || []);
      } catch (error) {}
    };

    const timer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = async () => {
    if (!flashSale.endDate) {
      toast.error('Please set an end date');
      return;
    }
    setSaving(true);
    try {
      await api.post('/flash-sale', flashSale);
      toast.success('Flash Sale updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = (id: string) => {
    setFlashSale(prev => ({
      ...prev,
      products: prev.products.includes(id) 
        ? prev.products.filter(p => p !== id) 
        : [...prev.products, id]
    }));
  };

  const selectedProducts = products.filter(p => flashSale.products.includes(p._id));

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-red" /></div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Flash Sale Management</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-red hover:bg-brand-red-dark">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label>End Date & Time</Label>
              <Input 
                type="datetime-local" 
                value={flashSale.endDate} 
                onChange={(e) => setFlashSale({ ...flashSale, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 cursor-pointer pt-2">
              <Checkbox 
                id="isActive" 
                checked={flashSale.isActive} 
                onCheckedChange={(v) => setFlashSale({ ...flashSale, isActive: !!v })} 
              />
              <Label htmlFor="isActive" className="cursor-pointer">Enable Flash Sale</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products ({flashSale.products.length})</CardTitle>
              <div className="relative w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-8 h-9 text-xs" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Selected List */}
               {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-4 border-b">
                  {selectedProducts.map(p => (
                    <div key={p._id} className="flex items-center gap-1 bg-brand-red/10 text-brand-red px-2 py-1 rounded-md text-xs font-medium">
                      <span className="truncate max-w-[100px]">{p.name}</span>
                      <button onClick={() => toggleProduct(p._id)}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selection List */}
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {products.map(p => (
                   <label key={p._id} className="flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors text-left">
                      <Checkbox 
                        checked={flashSale.products.includes(p._id)} 
                        onCheckedChange={() => toggleProduct(p._id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-500">SKU: {p.sku || 'N/A'} | Price: {formatPrice(p.price)}</p>
                      </div>
                      {p.images?.[0]?.url && <img src={p.images[0].url} className="h-8 w-8 rounded object-cover" />}
                   </label>
                ))}
                {products.length === 0 && !loading && <p className="text-center text-gray-400 py-4 text-xs font-medium">No products found</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
