import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import TopHeader from '@/components/layout/TopHeader'; // This is just the announcement bar now
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

const FloatingContact = dynamic(() => import('@/components/layout/FloatingContact'));

async function getCategories() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories in layout:', error);
    return [];
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  // Pre-render the logo on the server for instant LCP
  const serverLogo = (
    <Link href="/" className="flex-shrink-0">
      <Image 
        src="/logo-small.png" 
        alt="RS Automart" 
        width={180} 
        height={50} 
        className="h-9 md:h-10 w-auto" 
        priority 
      />
    </Link>
  );

  return (
    <>
      <TopHeader />
      <Navbar initialCategories={categories} logo={serverLogo} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <FloatingContact />
    </>
  );
}
