import type { Metadata } from 'next';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FlashSale from '@/components/home/FlashSale';
import BestSellers from '@/components/home/BestSellers';
import NewArrivals from '@/components/home/NewArrivals';
import TrustBadges from '@/components/home/TrustBadges';

export const metadata: Metadata = {
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
  description: 'Premium car & bike accessories shop in Bangladesh. Free delivery on orders above ৳999.',
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

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <h1 className="sr-only">RS Automart – Premium Car & Bike Accessories in Bangladesh</h1>
      <HeroBanner />
      <FeaturedCategories />
      <FlashSale />
      <BestSellers />
      <NewArrivals />
      <TrustBadges />
    </>
  );
}
