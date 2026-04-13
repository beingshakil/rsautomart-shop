'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Tag, ArrowLeft, Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/offers', icon: Tag, label: 'Offers & Coupons' },
  { href: '/admin/flash-sale', icon: Zap, label: 'Flash Sale' },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-footer.png" alt="RS Automart" className="h-9 w-auto" />
        </Link>
        <p className="text-[10px] uppercase font-black text-brand-red mt-2 tracking-widest border border-brand-red/30 inline-block px-2 py-0.5 rounded">
          Admin Control
        </p>
      </div>
      <nav className="mt-2 px-3 space-y-1 flex-1">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-brand-red/20 text-brand-red'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-6">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-brand-black text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="w-64 bg-brand-black min-h-screen text-white flex-shrink-0 hidden lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-[70] bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-[80] w-64 bg-brand-black text-white flex flex-col animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
