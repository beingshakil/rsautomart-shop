import { Truck, RefreshCw, Shield, Headphones } from 'lucide-react';

const badges = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ৳999' },
  { icon: RefreshCw, title: '7-Day Return', desc: 'Easy return policy' },
  { icon: Shield, title: 'Genuine Products', desc: '100% authentic items' },
  { icon: Headphones, title: '24/7 Support', desc: 'We are always here' },
];

export default function TrustBadges() {
  return (
    <section className="bg-gray-50 py-8 md:py-10">
      <div className="max-w-360 mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-brand-black">Why Choose Us</h2>
          <span className="block w-16 h-[3px] bg-brand-red rounded mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-1.5 p-3">
              <div className="w-12 h-12 rounded-full bg-brand-red-light flex items-center justify-center">
                <Icon size={22} className="text-brand-red" />
              </div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
