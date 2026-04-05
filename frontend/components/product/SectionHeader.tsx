import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
}

export default function SectionHeader({ title, viewAllHref }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-8">
      <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wide text-brand-black relative">
        {title}
        <span className="absolute -bottom-[13px] left-0 w-full h-[3px] bg-brand-red rounded" />
      </h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-red-dark transition-colors flex items-center gap-1"
        >
          View All <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
