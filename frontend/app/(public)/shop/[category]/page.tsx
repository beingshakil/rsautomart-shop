import { Metadata } from 'next';
import CategoryView from '@/components/category/CategoryView';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getCategory(slug: string) {
  try {
    const { data } = await axios.get(`${API_URL}/api/categories/${slug}`);
    return data.category;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found | RS Automart',
    };
  }

  return {
    title: category.metaTitle || `${category.name} | RS Automart`,
    description: category.metaDescription || category.description || `Browse our collection of ${category.name} at RS Automart.`,
    openGraph: {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description,
      images: category.image?.url ? [{ url: category.image.url }] : [],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryData = await getCategory(slug);

  return <CategoryView categorySlug={slug} initialCategoryData={categoryData} />;
}
