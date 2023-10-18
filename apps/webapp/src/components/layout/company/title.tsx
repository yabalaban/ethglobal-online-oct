import { Company } from '@/lib/cryptovc/types';

export function CompanyName({ company }: { company: Company }) {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-2 text-5xl font-medium">{company.name}</h1>
      </div>
    </>
  );
}
