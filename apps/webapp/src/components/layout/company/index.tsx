import { Company } from '@/lib/cryptovc/types';
import { CompanyPic, Media } from './media';
import { Card, NewCard } from './card';
import { fakerEN } from '@faker-js/faker';

export function Page({ company }: { company: Company }) {
  const pic = {
    src: company.pic as string,
    alt: company.description,
  };
  const info = {
    ipfs: company.ipfs,
    creator: company.creator,
  };
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8 ">
          <div className="basis-full lg:basis-4/6">
            <Media pic={pic} info={info} />
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
  const pic = {
    src: fakerEN.image.urlPicsumPhotos(),
    alt: '',
  };
  const prefill = {
    name: fakerEN.company.catchPhraseNoun(),
    description: fakerEN.lorem.paragraph(),
  };
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8 ">
          <div className="basis-full lg:basis-4/6">
            <CompanyPic pic={pic} />
          </div>
          <div className="basis-full lg:basis-2/6 md:x-2">
            <NewCard prefill={prefill} />
          </div>
        </div>
      </div>
    </>
  );
}
