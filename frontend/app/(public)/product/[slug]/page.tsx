import type { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | RS Automart',
    };
  }

  const title = product.metaTitle || `${product.name} | RS Automart`;
  const description = product.metaDescription || product.shortDescription || product.description?.substring(0, 160).replace(/<[^>]*>?/gm, '') || '';
  const image = product.images?.[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
