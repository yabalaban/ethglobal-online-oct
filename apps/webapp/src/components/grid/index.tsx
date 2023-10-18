import { getCompanies } from '@/lib/cryptovc';
import { Company } from '@/lib/cryptovc/types';
import Link from 'next/link';
import { CompanyGridTile } from './tile';
import Grid from './grid';
import clsx from 'clsx';

export default function CompanyGridItems({ companies }: { companies: Company[] }) {
  return (
    <>
      {companies.map((company) => (
        <Grid.Item key={company.id} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/company/${company.id}`}>
            <CompanyGridTile
              alt={company.name}
              src={company.pic as string}
              company={{
                title: company.name as string,
                description: company.description as string,
              }}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}

export async function CompanyGrid() {
  const companies = await getCompanies();
  const filters = [
    { title: 'Progress', path: 'p1' },
    { title: 'Goal', path: 'p2' },
    { title: 'Participation', path: 'p3' },
  ];

  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black dark:text-white md:flex-row">
        <div className="order-last w-full md:order-none">
          {companies.length > 0 ? (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <CompanyGridItems companies={companies} />
            </Grid>
          ) : null}
        </div>
        <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={filters} title="Sort by" />
        </div>
      </div>
    </>
  );
}

export type ListItem = { title: string; path: string };

function FilterItemList({ list }: { list: ListItem[] }) {
  const DynamicTag = Link;

  return (
    <>
      {list.map((item: ListItem, i) => (
        <li className="mt-2 flex text-sm text-black dark:text-white" key={i}>
          <DynamicTag
            prefetch={false}
            href={''}
            className={clsx('w-full hover:underline hover:underline-offset-4', {
              'underline underline-offset-4': false,
            })}
          >
            {item.title}
          </DynamicTag>
        </li>
      ))}
    </>
  );
}

export function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav>
        {title ? (
          <h3 className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
            {title}
          </h3>
        ) : null}
        <ul className="hidden md:block">
          <FilterItemList list={list} />
        </ul>
      </nav>
    </>
  );
}
