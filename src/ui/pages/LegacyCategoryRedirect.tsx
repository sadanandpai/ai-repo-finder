import { Navigate, useParams } from 'react-router';
import { categoryBySlug } from '../../logic/index.ts';
import { NotFoundPage } from './NotFoundPage.tsx';

export function LegacyCategoryRedirect() {
  const { categorySlug } = useParams();
  const category = categorySlug ? categoryBySlug(categorySlug) : undefined;
  if (!category) return <NotFoundPage />;
  return <Navigate to={`/explore/${category.slug}`} replace />;
}
