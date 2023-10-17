import Link from 'next/link';
import Logo from '../logo';
import { Suspense } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu } from '@/lib/cryptovc/types';
import { getMenu } from '@/lib/cryptovc';

export default async function Navbar() {
  const menu = getMenu();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <Logo />
            <div className="ml-2 flex-none text-sm font-medium md:hidden lg:block">CryptoVC</div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Suspense>
          <div className="md:ml-auto">
            <Suspense>
              <ConnectButton />
            </Suspense>
          </div>
        </Suspense>
      </div>
    </nav>
  );
}
