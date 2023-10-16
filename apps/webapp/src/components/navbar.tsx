import Link from 'next/link';
import Logo from './logo';
import { Suspense } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default async function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">MobileMenu</div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <Logo />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              CryptoVC
            </div>
          </Link>
        </div>
        <div className="flex justify-end md:w-1/3">
          <Suspense>
            <ConnectButton />;
          </Suspense>
        </div>
      </div>
    </nav>
  );
}