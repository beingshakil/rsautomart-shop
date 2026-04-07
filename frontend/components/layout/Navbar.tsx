'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import CartDrawer from '@/components/cart/CartDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const wishlistItems = useWishlistStore((s) => s.items);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-black text-white py-1.5 text-[11px] sm:text-xs tracking-wide font-medium overflow-hidden">
        {/* Desktop / tablet: static centered */}
        <div className="hidden sm:block text-center">
          🚚 FREE SHIPPING on orders over ৳999 &nbsp;|&nbsp; Cash on Delivery Available
        </div>
        {/* Mobile: marquee */}
        <div className="sm:hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">
            <span className="mx-6">🚚 FREE SHIPPING on orders over ৳999</span>
            <span className="mx-6">💵 Cash on Delivery</span>
            <span className="mx-6">📞 +880 1919-242866</span>
            <span className="mx-6">🚚 FREE SHIPPING on orders over ৳999</span>
            <span className="mx-6">💵 Cash on Delivery</span>
            <span className="mx-6">📞 +880 1919-242866</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-360 mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 order-first"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo-small.png" alt="RS Automart" width={180} height={50} className="h-9 md:h-10 w-auto" priority />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="order-3 lg:order-2 w-full lg:flex-1 lg:max-w-xl">
            <div className="flex border-2 border-brand-red rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search for parts, accessories, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white placeholder-gray-400"
              />
              <button type="submit" className="bg-brand-black hover:bg-brand-red transition-colors px-5 flex items-center justify-center">
                <Search size={16} className="text-white" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="order-2 lg:order-3 flex items-center gap-3 md:gap-5 flex-shrink-0">
            {/* Wishlist */}
            <Link href="/wishlist" className="hidden md:flex flex-col items-center text-gray-600 hover:text-brand-red transition-colors group">
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] mt-0.5 font-medium uppercase tracking-wide">Wishlist</span>
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-1 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[9px] bg-brand-red">
                  {wishlistItems.length}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center text-gray-600 hover:text-brand-red transition-colors group">
              <span className="relative">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-brand-red text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] mt-0.5 font-medium uppercase tracking-wide">Cart</span>
            </button>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-1" />}>
                  <User size={18} />
                  <span className="hidden sm:inline text-xs">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem render={<Link href="/profile" />}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/orders" />}>My Orders</DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/wishlist" />}>Wishlist</DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem render={<Link href="/admin" />}>Admin Dashboard</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-brand-red transition-colors"
              >
                <User size={14} /> Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white pb-4">
            <nav className="max-w-360 mx-auto px-4 flex flex-col gap-2 pt-4">
              <Link href="/shop" className="py-2 hover:text-brand-red" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
              <Link href="/offers" className="py-2 hover:text-brand-red" onClick={() => setMobileMenuOpen(false)}>Offers & Deals</Link>
              <Link href="/wishlist" className="py-2 hover:text-brand-red sm:hidden" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
