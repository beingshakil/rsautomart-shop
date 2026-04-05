import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-gray-400 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-360 mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand */}
        <div>
          <Image src="/logo-small.png" alt="RS Automart" width={160} height={50} className="h-9 w-auto mb-3 brightness-0 invert" />
          <p className="text-sm leading-relaxed text-gray-500">
            Your one-stop destination for premium quality auto parts and accessories. We deliver reliability, performance, and value — straight to your doorstep.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            {[
              { label: 'Facebook', svg: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'Instagram', svg: 'M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z' },
              { label: 'YouTube', svg: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
            ].map(({ label, svg }) => (
              <a
                key={label}
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all duration-300"
                title={label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={svg} /></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Customer */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-5 relative pb-2">
            Customer
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-red rounded" />
          </h4>
          <ul className="space-y-2.5">
            {[
              { href: '/profile', label: 'My Account' },
              { href: '/cart', label: 'Shopping Cart' },
              { href: '/wishlist', label: 'Wishlist' },
              { href: '/orders', label: 'Order Tracking' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-500 hover:text-brand-red transition-colors hover:pl-1 duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Information */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-5 relative pb-2">
            Information
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-red rounded" />
          </h4>
          <ul className="space-y-2.5">
            <li className="text-sm text-gray-500">Shipping: ৳60 (Dhaka) / ৳120 (Outside)</li>
            <li className="text-sm text-gray-500">Free Delivery on orders above ৳999</li>
            <li className="text-sm text-gray-500">7 Days Return Policy</li>
            <li className="text-sm text-gray-500">Cash on Delivery Available</li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-5 relative pb-2">
            Contact
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-brand-red rounded" />
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-500">
              <Phone size={14} className="text-brand-red flex-shrink-0" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-500">
              <Mail size={14} className="text-brand-red flex-shrink-0" />
              <span>support@rsautomart.com</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <MapPin size={14} className="text-brand-red flex-shrink-0 mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-360 mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 text-center md:text-left">
            &copy; {new Date().getFullYear()} RS AUTOMART. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {['bKash', 'VISA', 'Mastercard', 'COD'].map((m) => (
              <span key={m} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
