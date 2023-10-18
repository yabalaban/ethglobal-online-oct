import { Company } from '@/lib/cryptovc/types';
import { Media } from './media';
import { Card } from './card';

export function Page({ company }: { company: Company }) {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8 ">
          <div className="basis-full lg:basis-4/6">
            <Media company={company} />
          </div>
          <div className="basis-full lg:basis-2/6 md:x-2">
            <Card company={company} />
          </div>
        </div>
      </div>
    </>
  );
}
