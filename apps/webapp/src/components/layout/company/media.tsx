'use client';

import { Company, Person } from '@/lib/cryptovc/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

function CompanyPic({ pic }: { pic: { src: string; alt: string } }) {
  return (
    <>
      <div className="bg-white dark:border-neutral-800 dark:bg-black rounded-lg border border-neutral-200 shadow-xl truncate">
        <div className="relative aspect-square h-full max-h-[550px] w-full">
          {
            <Image
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={pic.alt as string}
              src={pic.src as string}
              priority={true}
            />
          }
        </div>
      </div>
    </>
  );
}

// Profile pic

function Avatar({ avatar }: { avatar: { src: string; alt: string } }) {
  return (
    <div className="relative w-24 h-24 rounded-full aspect-square truncate m-4">
      <Image
        fill
        sizes="96px 96px"
        alt={avatar.alt as string}
        src={avatar.src as string}
        priority={true}
      />
    </div>
  );
}

function PersonInfo({ person }: { person: Person }) {
  return (
    <div className="self-center grow">
      <div className="flex flex-col lg:gap-1">
        <a className="text-4xl text-neutral-100">{person.handle}</a>
        <a className="text-sm text-neutral-300">{person.address}</a>
      </div>
    </div>
  );
}

function ProfileLink({ link }: { link: { title: string; path: string; icon: string } }) {
  function onClick() {
    console.log('open', link);
  }

  return (
    <div className="hover:underline text-neutral-300">
      <Link href="" onClick={onClick}>
        {link.title}
      </Link>
    </div>
  );
}

function ProfileLinks({
  links,
}: {
  links: { eth: string; ipfs: string; twitter: string | undefined };
}) {
  return (
    <div className="self-center justify-self-end p-4">
      <div className="flex flex-col grid justify-items-end">
        <ProfileLink link={{ title: 'etherscan', path: links.eth, icon: 'ether' }} />
        <ProfileLink link={{ title: 'ipfs', path: links.ipfs, icon: 'ipfs' }} />
        {links.twitter ? (
          <ProfileLink link={{ title: 'twitter', path: links.twitter, icon: 'twitter' }} />
        ) : null}
      </div>
    </div>
  );
}

function Creator({ company }: { company: Company }) {
  const creator = company.creator;
  const avatar = {
    src: creator.pic,
    alt: creator.handle ? creator.handle : creator.address,
  };
  const links = {
    eth: creator.handle ? creator.handle : creator.address,
    ipfs: company.ipfs,
    twitter: 'somecurioustest', // get from creator.identities
  };
  return (
    <>
      <div className="bg-white dark:border-neutral-900 shadow-xl dark:bg-neutral-800 rounded-lg border border-neutral-200 h-full w-full">
        <div className="flex flex-row lg:flex-row">
          <Avatar avatar={avatar} />
          <PersonInfo person={creator} />
          <ProfileLinks links={links} />
        </div>
      </div>
    </>
  );
}

export function Media({ company }: { company: Company }) {
  const pic = {
    src: company.pic as string,
    alt: company.description,
  };
  return (
    <>
      <div className="flex flex-col lg:gap-4">
        <CompanyPic pic={pic} />
        <Creator company={company} />
      </div>
    </>
  );
}