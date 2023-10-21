'use client';

import { SortableGrid } from '@/components/layout/grid';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';
import { useAccount } from 'wagmi';

export default function PortfolioPage() {
  const [globalState] = useAtom(globalStateAtom);
  const { address } = useAccount();
  const currentAddress = address!.toLowerCase();
  const companies = Object.values(globalState.companies).filter(
    (company) => company.creator.address === currentAddress,
  );
  const filters = {
    title: 'Filter by',
    items: [],
  };
  return (
    <>
      <SortableGrid companies={companies} filters={filters} />
    </>
  );
}
