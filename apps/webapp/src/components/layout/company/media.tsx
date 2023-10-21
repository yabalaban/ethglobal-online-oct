'use client';

import { Person } from '@/lib/types';
import { fakerEN } from '@faker-js/faker';
import Image from 'next/image';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/lib';

export function CompanyPic({ image }: { image: { src: string; alt: string } }) {
  return (
    <>
      <div className="bg-white dark:border-neutral-800 dark:bg-black rounded-lg border border-neutral-200 shadow-xl truncate">
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
        <a className="text-4xl text-neutral-100">{person.ens}</a>
        <a className="text-sm text-neutral-300">{person.address}</a>
      </div>
    </div>
  );
}

function ProfileLink({ link }: { link: { title: string; path: string; icon: string } }) {
  let href = '';
  if (link.title === 'twitter') {
    href += 'https://twitter.com/' + link.path;
  } else if (link.title === 'etherscan') {
    href += 'https://etherscan.io/address/' + link.path;
  } else {
    href += 'https://ipfs.io/ipfs/' + link.path;
  }
  console.log(href);

  return (
    <div className="hover:underline text-neutral-300">
      <Link href={href} className="some classes" target="_blank">
        {link.title}
      </Link>
    </div>
  );
}

function ProfileLinks({
  links,
}: {
  links: { address: string; ipfs: string; twitter: string | undefined };
}) {
  return (
    <div className="self-center justify-self-end p-4">
      <div className="flex flex-col grid justify-items-end">
        <ProfileLink link={{ title: 'etherscan', path: links.address, icon: 'ether' }} />
        <ProfileLink link={{ title: 'ipfs', path: links.ipfs, icon: 'ipfs' }} />
        {links.twitter !== '' ? (
          <ProfileLink link={{ title: 'twitter', path: links.twitter, icon: 'twitter' }} />
        ) : null}
      </div>
    </div>
  );
}

function Creator({ info }: { info: { ipfs: string; creator: Person } }) {
  const [globalState] = useAtom(globalStateAtom);

  const creator = info.creator;
  const avatar = {
    src: creator.avatar ?? fakerEN.image.avatarGitHub(),
    alt: creator.ens ?? creator.address,
  };
  const links = {
    address: creator.address,
    ipfs: info.ipfs,
    twitter: globalState.getTwitterHandle(creator.address),
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

export function Media({
  image,
  info,
}: {
  image: {
    src: string;
    alt: string;
  };
  info: {
    ipfs: string;
    creator: Person;
  };
}) {
  return (
    <>
      <div className="flex flex-col lg:gap-4">
        <CompanyPic image={image} />
        <Creator info={info} />
      </div>
    </>
  );
}
