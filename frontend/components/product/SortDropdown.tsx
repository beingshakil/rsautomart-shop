'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'popular', label: 'Best selling' },
  { value: 'name_asc', label: 'Alphabetically, A-Z' },
  { value: 'name_desc', label: 'Alphabetically, Z-A' },
  { value: 'price_asc', label: 'Price, low to high' },
  { value: 'price_desc', label: 'Price, high to low' },
  { value: 'newest', label: 'Date, new to old' },
  { value: 'oldest', label: 'Date, old to new' },
];

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = sortOptions.find((o) => o.value === value)?.label || 'Best selling';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-gray-200 rounded-md px-4 py-2.5 text-sm bg-white hover:border-gray-300 transition-colors min-w-[180px] justify-between"
      >
        <span className="text-gray-700">{currentLabel}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px] py-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                value === opt.value
                  ? 'text-brand-red font-medium border-l-2 border-brand-red bg-gray-50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-black'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
