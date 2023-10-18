import { Page } from '@/components/layout/company';
import { getCompany } from '@/lib/cryptovc';
import { notFound } from 'next/navigation';

export default async function CompanyPage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id);
  if (!company) return notFound();

  return (
    <>
      <div className="mx-auto max-w-screen-2xl pb-4 text-black dark:text-white">
        <Page company={company} />
      </div>
    </>
  );
}
