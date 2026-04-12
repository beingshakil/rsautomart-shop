import type { Metadata } from 'next';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FlashSale from '@/components/home/FlashSale';
import BestSellers from '@/components/home/BestSellers';
import NewArrivals from '@/components/home/NewArrivals';
import TrustBadges from '@/components/home/TrustBadges';

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

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <h1 className="sr-only">Car Accessories Online - Best Car Accessories Shop in Bangladesh</h1>
      <HeroBanner />
      <FeaturedCategories />
      <FlashSale />
      <BestSellers />
      <NewArrivals />
      <TrustBadges />
    </>
  );
}
