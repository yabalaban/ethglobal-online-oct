'use client';

import { Page } from '@/components/layout/company';
import { notFound } from 'next/navigation';
import { Address } from 'viem';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';

export default function CompanyPage({ params }: { params: { id: Address } }) {
  const [globalState] = useAtom(globalStateAtom);
  const company = globalState.companies[params.id];
  if (!company) return notFound();

  return (
    <>
      <div className="mx-auto max-w-screen-2xl pb-4 text-black dark:text-white">
        <Page company={company} />
      </div>
    </>
  );
}
