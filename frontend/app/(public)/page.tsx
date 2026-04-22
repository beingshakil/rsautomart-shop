import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroBanner from '@/components/home/HeroBanner';
const FeaturedCategories = dynamic(() => import('@/components/home/FeaturedCategories'));
const BestSellers = dynamic(() => import('@/components/home/BestSellers'));
const NewArrivals = dynamic(() => import('@/components/home/NewArrivals'));
const FlashSale = dynamic(() => import('@/components/home/FlashSale'));
const TrustBadges = dynamic(() => import('@/components/home/TrustBadges'));

async function getHomeData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  const endpoints = [
    `${API_URL}/api/categories`,
    `${API_URL}/api/products/best-sellers`,
    `${API_URL}/api/products/new-arrivals`,
    `${API_URL}/api/flash-sale`,
  ];

  try {
    const responses = await Promise.all(
      endpoints.map(url => fetch(url, { next: { revalidate: 60 } })) // Cache Flash Sale shorter (1 min)
    );
    
    const [categoriesData, bestSellersData, newArrivalsData, flashSaleData] = await Promise.all(
      responses.map(res => res.ok ? res.json() : { products: [], categories: [], flashSale: null })
    );

    return {
      categories: categoriesData.categories || [],
      bestSellers: bestSellersData.products || [],
      newArrivals: newArrivalsData.products || [],
      flashSale: flashSaleData.flashSale || null,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { categories: [], bestSellers: [], newArrivals: [], flashSale: null };
  }
}

export const metadata: Metadata = {
  title: 'Car Accessories Online in Bangladesh - Interior Car Lights & Cleaner',
  description:
    'Buy car accessories online in Bangladesh. Shop car interior cleaner, interior car lights & more at the best car accessories shop. Free delivery over ৳999!',
  alternates: {
    canonical: 'https://www.rsautomart.shop',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RS Automart',
  alternateName: 'RS Automart Shop',
  url: 'https://www.rsautomart.shop',
  description: 'Buy car accessories online at RS Automart — your trusted car accessories shop in Bangladesh. Shop car interior cleaner, interior car lights & more.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.rsautomart.shop/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RS Automart',
  url: 'https://www.rsautomart.shop',
  logo: 'https://www.rsautomart.shop/logo-small.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+880-1919-242866',
    contactType: 'customer service',
  },
  sameAs: [
    'https://www.facebook.com/rsautomartshop',
    'https://www.instagram.com/rsautomartshop',
    'https://www.tiktok.com/@rs.automart',
  ],
};

export default async function HomePage() {
  const { categories, bestSellers, newArrivals, flashSale } = await getHomeData();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <h1 className="sr-only">Car Accessories Online - Best Car Accessories Shop in Bangladesh</h1>
      <HeroBanner />
      <FeaturedCategories initialCategories={categories} />
      <FlashSale initialData={flashSale} />
      <BestSellers initialProducts={bestSellers} />
      <NewArrivals initialProducts={newArrivals} />
      <TrustBadges />
    </>
  );
}
