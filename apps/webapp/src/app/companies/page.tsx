'use client';

import { SortableGrid } from '@/components/layout/grid';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';

export default function CompaniesPage() {
  const [globalState] = useAtom(globalStateAtom);
  const companies = Object.values(globalState.companies);
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
