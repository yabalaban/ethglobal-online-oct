'use client';

import { fakerEN } from '@faker-js/faker';
import { CreateCard } from '../card';
import { CompanyPic } from '../media';

function Page() {
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
            <CreateCard prefill={prefill} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function CreateCompanyPage() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl pb-4 text-black dark:text-white">
        <Page />
      </div>
    </>
  );
}
