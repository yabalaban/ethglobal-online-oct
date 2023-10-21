import { CompanyPic, Media } from './media';
import { Card, NewCard } from './card';
import { fakerEN } from '@faker-js/faker';
import { Company } from '@/lib/types';
import { fromHex } from 'viem';

export function Page({ company }: { company: Company }) {
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

export function NewPage() {
  const image = {
    src: fakerEN.image.urlPicsumPhotos(),
    alt: '',
  };
  const prefill = {
    name: fakerEN.company.catchPhraseNoun(),
    description: fakerEN.lorem.paragraph(),
    image: image.src,
  };
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8 ">
          <div className="basis-full lg:basis-4/6">
            <CompanyPic image={image} />
          </div>
          <div className="basis-full lg:basis-2/6 md:x-2">
            <NewCard prefill={prefill} />
          </div>
        </div>
      </div>
    </>
  );
}
