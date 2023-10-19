import { SortableGrid } from '@/components/layout/grid';
import { getCompanies } from '@/lib/cryptovc';

export default async function CompaniesPage() {
  const companies = await getCompanies();
  const filters = {
    title: 'Sort by',
    items: [
      { title: 'Relevance', path: '' },
      { title: 'Progress', path: 'progress' },
      { title: 'Goal', path: 'goal' },
      { title: 'Participation', path: 'participation' },
    ],
  };
  return (
    <>
      <SortableGrid companies={companies} filters={filters} />
    </>
  );
}
