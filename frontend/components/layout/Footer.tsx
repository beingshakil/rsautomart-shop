import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-gray-400 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-360 mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand */}
        <div>
          <Image
            src="/logo-footer.png"
            alt="RS Automart"
            width={280}
            height={60}
            className="h-14 w-auto"
            loading="eager"
            priority
          />
          <p className="text-sm leading-relaxed text-gray-400">
            Bangladesh&apos;s trusted online shop for premium car & bike accessories. Quality products with affordable pricing and fast delivery.
          </p>
        </div>

        {/* Column 2: Customer */}
        <div>
          <h4 className="text-base font-bold uppercase text-white mb-5">Customer</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/profile', label: 'Account' },
              { href: '/cart', label: 'Cart' },
              { href: '/wishlist', label: 'Wishlist' },
              { href: '/orders', label: 'Track Order' },
              { href: '/offers', label: 'Offers & Deals' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-500 hover:text-brand-red transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Information */}
        <div>
          <h4 className="text-base font-bold uppercase text-white mb-5">Information</h4>
          <ul className="space-y-2.5">
            <li className="text-sm text-gray-500">Inside Dhaka: 70 ৳</li>
            <li className="text-sm text-gray-500">Outside Dhaka: 120 ৳</li>
            <li className="text-sm text-brand-red font-semibold">FREE Delivery Over ৳999</li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="text-base font-bold uppercase text-white mb-5">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li>
              <span className="text-gray-300 font-medium">Address:</span> North Chashara, Link Rd, Dhaka, Bangladesh
            </li>
            <li>
              <span className="text-gray-300 font-medium">E-mail:</span>{' '}
              <a href="mailto:rsautomartshop@gmail.com" className="hover:text-brand-red transition-colors">rsautomartshop@gmail.com</a>
            </li>
            <li>
              <span className="text-gray-300 font-medium">Phone:</span>{' '}
              <a href="tel:+8801919242866" className="hover:text-brand-red transition-colors">01919-242866</a>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-2.5">
            {[
              { label: 'Facebook', href: 'https://www.facebook.com/rsautomartshop', svg: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'Instagram', href: 'https://www.instagram.com/rsautomartshop', svg: 'M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z' },
              { label: 'Tiktok', href: 'https://www.tiktok.com/@rs.automart', svg: 'M9 12a4 4 0 104 4V4a5 5 0 005 5' },
            ].map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
                title={label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={svg} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-360 mx-auto px-4 py-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RS Automart - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
