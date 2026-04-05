'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { dummyProducts } from '@/lib/dummyData';

export function useProducts(params?: Record<string, string>) {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(params || {}).toString();
        const { data } = await api.get(`/products?${query}`, { timeout: 3000 });
        setProducts(data.products);
        setPagination(data.pagination);
      } catch {
        // Fallback to dummy data
        let filtered = [...dummyProducts];

        // Apply filters
        if (params?.category) {
          filtered = filtered.filter((p) => p.category._id === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.tags.some((t: string) => t.includes(q))
          );
        }

        // Apply sort
        switch (params?.sort) {
          case 'price_asc': filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break;
          case 'price_desc': filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break;
          case 'popular': filtered.sort((a, b) => b.totalSold - a.totalSold); break;
          case 'rating': filtered.sort((a, b) => b.ratings.average - a.ratings.average); break;
          case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
          case 'oldest': filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
        }

        const page = parseInt(params?.page || '1');
        const limit = parseInt(params?.limit || '12');
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        setProducts(paged);
        setPagination({ page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit) });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, pagination, loading };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured', { timeout: 3000 })
      .then(({ data }) => setProducts(data.products))
      .catch(() => {
        setProducts(dummyProducts.filter((p) => p.isFeatured));
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useBestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/best-sellers', { timeout: 3000 })
      .then(({ data }) => setProducts(data.products))
      .catch(() => {
        setProducts(dummyProducts.filter((p) => p.isBestSeller).sort((a, b) => b.totalSold - a.totalSold));
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useNewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/new-arrivals', { timeout: 3000 })
      .then(({ data }) => setProducts(data.products))
      .catch(() => {
        setProducts(
          dummyProducts
            .filter((p) => p.isNewArrival)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
