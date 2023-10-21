'use client';
import Link from 'next/link';
import Logo from '../../logo';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getMenu } from '@/lib/cryptovc';
import { Menu } from './menu';

export default function Navbar() {
  const menu = getMenu();

  return (
    <nav className="relative flex items-center border-b border-neutral-200 dark:border-neutral-700 justify-between p-4 lg:px-6">
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <Logo />
            <div className="ml-2 flex-none text-sm font-medium md:hidden lg:block">CryptoVC</div>
          </Link>
          <Menu items={menu} />
        </div>
        <div className="md:ml-auto flex-row flex">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
