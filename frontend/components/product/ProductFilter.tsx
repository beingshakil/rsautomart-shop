'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import api from '@/lib/api';
import { dummyCategories } from '@/lib/dummyData';

interface ProductFilterProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function ProductFilter({ filters, onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => setCategories(dummyCategories));
  }, []);

  const applyPriceFilter = () => {
    onFilterChange({ ...filters, minPrice, maxPrice });
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({ sort: filters.sort || 'popular' });
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.brand;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg uppercase tracking-wide text-brand-black">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-brand-red hover:text-brand-red-dark font-medium flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black mb-3 relative pb-2">
          Categories
          <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-red rounded" />
        </h4>
        <div className="space-y-1">
          <button
            className={`block text-sm w-full text-left px-3 py-2 rounded transition-colors ${
              !filters.category
                ? 'bg-brand-red text-white font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red hover:pl-4 transition-all duration-200'
            }`}
            onClick={() => {
              const { category, ...rest } = filters;
              onFilterChange(rest);
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`block text-sm w-full text-left px-3 py-2 rounded transition-all duration-200 ${
                filters.category === cat._id
                  ? 'bg-brand-red text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red hover:pl-4'
              }`}
              onClick={() => onFilterChange({ ...filters, category: cat._id })}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black mb-3 relative pb-2">
          Price Range (৳)
          <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-red rounded" />
        </h4>
        <div className="flex gap-2">
          <div>
            <Label className="text-xs text-gray-500">Min</Label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max</Label>
            <Input
              type="number"
              placeholder="99999"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <Button
          size="sm"
          className="mt-3 w-full bg-brand-black hover:bg-brand-red text-white text-xs uppercase tracking-wider font-bold"
          onClick={applyPriceFilter}
        >
          Apply Price Filter
        </Button>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black mb-3 relative pb-2">
          Availability
          <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-red rounded" />
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-brand-red transition-colors">
            <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-brand-red transition-colors">
            <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
            On Sale
          </label>
        </div>
      </div>
    </div>
  );
}
