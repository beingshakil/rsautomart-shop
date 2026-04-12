import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Car Accessories Online in Bangladesh - Best Prices & Deals',
  description:
    'Browse and buy car accessories online in Bangladesh. Find car interior cleaner, interior car lights & more at the best car accessories shop near you.',
  alternates: {
    canonical: 'https://www.rsautomart.shop/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
