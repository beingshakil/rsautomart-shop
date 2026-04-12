import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Special Offers & Deals on Car Accessories - Save Big Today',
  description:
    'Grab the best deals on car accessories online. Exclusive discounts on car interior cleaner, interior car lights & more. Limited time offers!',
  alternates: {
    canonical: 'https://www.rsautomart.shop/offers',
  },
};

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
