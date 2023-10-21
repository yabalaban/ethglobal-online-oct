'use client';

import { notFound } from 'next/navigation';
import { Address, fromHex } from 'viem';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';
import { Company } from '@/lib/types';
import { fakerEN } from '@faker-js/faker';
import { Media } from '@/app/company/media';
import { Card } from '@/app/company/card';

function Page({ company }: { company: Company }) {
  const image = {
    src: company.details?.image ?? fakerEN.image.urlLoremFlickr(),
    alt: company.details?.description ?? '',
  };
  const info = {
    ipfs: fromHex(company.cid, 'string'),
    creator: company.creator,
  };
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8 ">
          <div className="basis-full lg:basis-4/6">
            <Media image={image} info={info} />
          </div>
          <div className="basis-full lg:basis-2/6 md:x-2">
            <Card company={company} />
          </div>
        </div>
      </div>
    </>
  );
}

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
