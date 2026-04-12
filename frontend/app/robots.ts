import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/orders', '/wishlist', '/cart', '/checkout', '/login', '/register', '/admin'],
      },
    ],
    sitemap: 'https://www.rsautomart.shop/sitemap.xml',
  };
}
