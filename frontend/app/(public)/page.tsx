import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FlashSale from '@/components/home/FlashSale';
import BestSellers from '@/components/home/BestSellers';
import NewArrivals from '@/components/home/NewArrivals';
import TrustBadges from '@/components/home/TrustBadges';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FlashSale />
      <BestSellers />
      <NewArrivals />
      <TrustBadges />
    </>
  );
}
