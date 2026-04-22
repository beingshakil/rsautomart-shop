export default function TopHeader() {
  return (
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
  );
}
