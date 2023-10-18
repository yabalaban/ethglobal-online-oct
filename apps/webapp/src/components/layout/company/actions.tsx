import { Company, Person } from '@/lib/cryptovc/types';
import clsx from 'clsx';

export function CompanyActions({ company, viewer }: { company: Company; viewer: Person }) {
  const creator = company.creator.address === viewer.address;
  const investor = company.investors.find((inv) => inv.address === viewer.address);

  return (
    <>
      <div>{company.creator.address}</div>
      <div className={clsx('mb-6 border-b dark:border-neutral-700 @container/label')}>
        <div className="mb-6 dark:text-white/[80%]">
          {creator}
          {investor}
        </div>
      </div>
    </>
  );
}
