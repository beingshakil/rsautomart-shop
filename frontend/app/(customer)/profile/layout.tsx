import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Manage Your Account',
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
