import { CompanyGrid } from '@/components/grid';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense>
        <CompanyGrid />
        <Footer />
      </Suspense>
    </>
  );
}
