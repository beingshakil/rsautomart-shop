import type { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    // 1. Fetch Main Product
    const productRes = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!productRes.ok) return null;
    const { product } = await productRes.json();

    // 2. Fetch Reviews and Related Products in parallel
    const [reviewsRes, relatedRes] = await Promise.all([
      fetch(`${API_URL}/api/products/${product._id}/reviews`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/products?category=${product.category?._id}&limit=5`, { next: { revalidate: 3600 } }),
    ]);

    const [reviewsData, relatedData] = await Promise.all([
      reviewsRes.ok ? reviewsRes.json() : { reviews: [] },
      relatedRes.ok ? relatedRes.json() : { products: [] },
    ]);

    return {
      product,
      reviews: reviewsData.reviews || [],
      related: (relatedData.products || []).filter((p: any) => p._id !== product._id).slice(0, 4),
    };
  } catch (error) {
    console.error('Error fetching full product data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductData(slug);
  const product = data?.product;

  if (!product) {
    return { title: 'Product Not Found | RS Automart' };
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
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <ProductDetail 
      slug={slug} 
      initialProduct={data.product} 
      initialReviews={data.reviews}
      initialRelated={data.related}
    />
  );
}
