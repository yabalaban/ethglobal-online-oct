'use-client';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import Navbar from '@/components/layout/navbar';
import { Suspense } from 'react';
import Footer from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CryptoVC',
  description: 'ETHOnline 2023',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="h-screen bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Providers>
          <Navbar />
          <div className="mx-auto py-4">
            <Suspense>{children}</Suspense>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
