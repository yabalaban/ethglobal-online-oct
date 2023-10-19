import { SortableGrid } from '@/components/layout/grid';
import { getCompanies } from '@/lib/cryptovc';

export default async function PortfolioPage() {
  const companies = await getCompanies();
  const filters = {
    title: 'Filter by',
    items: [
      { title: 'All', path: '' },
      { title: 'Portfolio', path: 'portfolio' },
      { title: 'Saved', path: 'saved' },
    ],
  };
  return (
    <>
      <SortableGrid companies={companies} filters={filters} />
    </>
  );
}
