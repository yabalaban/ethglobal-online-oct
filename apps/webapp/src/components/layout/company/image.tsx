'use client';

import Image from 'next/image';

export function CompanyImage({ image }: { image: { src: string; alt: string } }) {
  return (
    <>
      <div className="relative aspect-square h-full max-h-[550px] w-full">
        {
          <Image
            className="h-full w-full object-cover"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={image.alt as string}
            src={image.src as string}
            priority={true}
          />
        }
      </div>
    </>
  );
}
