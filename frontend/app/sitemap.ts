import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.rsautomart.shop';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.rsautomart.shop';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/offers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Fetch categories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const categories = data.categories || data || [];
      categoryPages = categories.map((cat: any) => ({
        url: `${BASE_URL}/shop/${cat.slug}`,
        lastModified: new Date(cat.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {}

  // Fetch products
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/products?limit=1000`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const products = data.products || data || [];
      productPages = products.map((product: any) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch {}

  return [...staticPages, ...categoryPages, ...productPages];
}
