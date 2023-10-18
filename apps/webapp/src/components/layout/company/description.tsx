import { Company } from '@/lib/cryptovc/types';
import clsx from 'clsx';

export function CompanyDescription({ company }: { company: Company }) {
  return (
    <>
      <div>{company.creator.address}</div>
      <div className={clsx('mb-6 border-b dark:border-neutral-700 @container/label')}>
        <div className="mb-6 dark:text-white/[80%]">
          <p className="break-words">{company.description}</p>
        </div>
      </div>
    </>
  );
}
