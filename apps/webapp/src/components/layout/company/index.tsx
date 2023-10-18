import { Company } from '@/lib/cryptovc/types';
import { CompanyImage } from './image';
import { CompanyDescription } from './description';
import { CompanyName } from './title';
import { mock } from '@/lib/cryptovc';
import { CompanyActions } from './actions';

export function CompanyCard({ company }: { company: Company }) {
  const image = {
    src: company.pic as string,
    alt: company.description,
  };
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <CompanyName company={company} />
        <div className="flex flex-col lg:flex-row lg:gap-8 ">
          <div className="bg-white dark:border-neutral-800 dark:bg-black rounded-lg border border-neutral-200 h-full w-full basis-full lg:basis-4/6 truncate">
            <CompanyImage image={image} />
            <CompanyDescription company={company} />
          </div>
          <div className="basis-full lg:basis-2/6 md:x-2">
            <CompanyActions company={company} viewer={mock.creatorA} />
          </div>
        </div>
      </div>
    </>
  );
}
