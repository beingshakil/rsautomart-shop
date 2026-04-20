'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import api from '@/lib/api';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState<any>({});
  const [variants, setVariants] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get('/categories').then(({ data }) => {
      setCategories(data.categories);
    }).catch(() => {});

    api.get(`/products/admin/${id}`).then(({ data }) => {
      const { product } = data;
      if (product) {
        setForm({
          name: product.name,
          slug: product.slug || '',
          description: product.description,
          shortDescription: product.shortDescription || '',
          price: String(product.price),
          discountPrice: String(product.discountPrice || ''),
          category: product.category?._id || product.category || '',
          brand: product.brand || '',
          sku: product.sku,
          stockQuantity: String(product.stock?.quantity || 0),
          warranty: product.warranty || '',
          tags: (product.tags || []).join(', '),
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          isNewArrival: product.isNewArrival,
          isActive: product.isActive,
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          existingImages: product.images || [],
        });
        setVariants(product.variants || []);
        setSpecs(product.specifications || []);
      }
    }).catch((error: any) => {
      const message = error.response?.data?.message || 'Failed to load product details';
      toast.error(message);
      console.error('Error loading product:', error);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'tags') return; // Handled separately below
        if (key === 'existingImages') formData.append(key, JSON.stringify(val));
        else if (typeof val === 'boolean') formData.append(key, String(val));
        else formData.append(key, val as string);
      });
      if (variants.length > 0) formData.append('variants', JSON.stringify(variants));
      if (specs.length > 0) formData.append('specifications', JSON.stringify(specs));
      if (form.tags) formData.append('tags', JSON.stringify(form.tags.split(',').map((t: string) => t.trim())));
      images.forEach((img) => formData.append('images', img));

      await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product updated');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Product Name <span className="text-red-500">*</span></Label>
                <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Slug</Label>
                <Input value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="product-url-slug" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">SKU</Label>
                <Input value={form.sku || ''} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></Label>
                <select className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Brand</Label>
                <Input value={form.brand || ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">Short Description</Label>
              <RichTextEditor
                value={form.shortDescription || ''}
                onChange={(html) => setForm({ ...form, shortDescription: html })}
                placeholder="Brief product summary (shown on product page above fold)..."
                minHeight="100px"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">Full Description</Label>
              <RichTextEditor
                value={form.description || ''}
                onChange={(html) => setForm({ ...form, description: html })}
                placeholder="Detailed product description with paragraphs, bullet points, headings..."
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Meta Title (SEO)</Label>
                <Input value={form.metaTitle || ''} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="SEO title" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Meta Description (SEO)</Label>
                <Input value={form.metaDescription || ''} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="SEO description" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Stock</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-1.5"><Label className="text-sm font-semibold text-gray-700">Price (৳) <span className="text-red-500">*</span></Label><Input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-semibold text-gray-700">Discount Price (৳)</Label><Input type="number" value={form.discountPrice || ''} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-semibold text-gray-700">Stock Quantity</Label><Input type="number" value={form.stockQuantity || ''} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} /></div>
            </div>
            <div className="mt-5 space-y-1.5"><Label className="text-sm font-semibold text-gray-700">Warranty</Label><Input value={form.warranty || ''} onChange={(e) => setForm({ ...form, warranty: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Images</CardTitle>
              <div className="text-xs text-gray-400">
                Total: {(form.existingImages?.length || 0) + images.length} / 6
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-4">
              {/* Existing Images */}
              {form.existingImages?.map((img: any, i: number) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-brand-red/20 group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-brand-red text-white text-[8px] font-bold px-1 rounded">LIVE</div>
                  <button
                    type="button"
                    onClick={() => {
                      const newExisting = form.existingImages.filter((_: any, j: number) => j !== i);
                      setForm({ ...form, existingImages: newExisting });
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* New Image Previews */}
              {images.map((file, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500/20 group">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] font-bold px-1 rounded">NEW</div>
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Add Button */}
              {(form.existingImages?.length || 0) + images.length < 6 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-red cursor-pointer transition-colors bg-gray-50">
                  <Plus size={24} className="text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImages([...images, ...files].slice(0, 6 - (form.existingImages?.length || 0)));
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              * Red border = Existing on server. Green border = New upload. First visible image will be primary.
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader><CardTitle>Variants</CardTitle></CardHeader>
          <CardContent>
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                <Input placeholder="Type (color/size)" value={v.type || ''} onChange={(e) => { const nv = [...variants]; nv[i] = { ...nv[i], type: e.target.value }; setVariants(nv); }} />
                <Input placeholder="Value" value={v.value || ''} onChange={(e) => { const nv = [...variants]; nv[i] = { ...nv[i], value: e.target.value }; setVariants(nv); }} />
                <Input placeholder="Price" type="number" value={v.price || ''} onChange={(e) => { const nv = [...variants]; nv[i] = { ...nv[i], price: e.target.value }; setVariants(nv); }} />
                <Input placeholder="Stock" type="number" value={v.stock || ''} onChange={(e) => { const nv = [...variants]; nv[i] = { ...nv[i], stock: e.target.value }; setVariants(nv); }} />
                <Button type="button" variant="outline" size="sm" onClick={() => setVariants(variants.filter((_, j) => j !== i))}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setVariants([...variants, { type: '', value: '', price: '', stock: '' }])}>
              + Add Variant
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
          <CardContent>
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <Input placeholder="Key (e.g. Material)" value={s.key || ''} onChange={(e) => { const ns = [...specs]; ns[i] = { ...ns[i], key: e.target.value }; setSpecs(ns); }} />
                <Input placeholder="Value (e.g. Plastic)" value={s.value || ''} onChange={(e) => { const ns = [...specs]; ns[i] = { ...ns[i], value: e.target.value }; setSpecs(ns); }} />
                <Button type="button" variant="outline" size="sm" onClick={() => setSpecs(specs.filter((_, j) => j !== i))}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSpecs([...specs, { key: '', value: '' }])}>
              + Add Specification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5"><Label className="text-sm font-semibold text-gray-700">Tags (comma separated)</Label><Input value={form.tags || ''} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g., dash cam, 4k, electronics" /></div>
            <div className="flex flex-wrap gap-6 mt-4">
              {(['isFeatured', 'isBestSeller', 'isNewArrival', 'isActive'] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={!!form[key]} onCheckedChange={(v) => setForm({ ...form, [key]: !!v })} />
                  <span className="text-sm">{key.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="bg-brand-red hover:bg-brand-red-dark" disabled={saving}>{saving ? 'Saving...' : 'Update Product'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
