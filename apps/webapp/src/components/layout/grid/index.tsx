'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import clsx from 'clsx';
import Link from 'next/link';
import { Company, Investment, Person, UmaPromise } from '@/lib/types';
import { ProgressLabel } from '../company/progress';
import { getClaimed, getFunds } from '@/lib';

function Grid(props: React.ComponentProps<'ul'>) {
  return (
    <ul {...props} className={clsx('grid grid-flow-row gap-4', props.className)}>
      {props.children}
    </ul>
  );
}

function GridItem(props: React.ComponentProps<'li'>) {
  return (
    <li {...props} className={clsx('aspect-square transition-opacity', props.className)}>
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;

export function CompactProgressLabel({
  progress,
}: {
  progress: {
    goal: number;
    actual: number;
    currency: string;
    investors: Investment[];
    funded: boolean;
    completed: boolean;
  };
}) {
  return (
    <div>
      {progress.completed ? (
        <div className="flex flex-row lg:gap-1 items-baseline">
          <div className="w-full text-right">
            <p className="font-medium text-sm">Seed round is over! 🎉</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-row lg:gap-1 items-baseline self-right">
          <div className="w-full text-right">
            <p className="font-medium text-sm">
              {progress.actual} {progress.currency}
            </p>
          </div>
          <div>
            <p className="font-light dark:text-white/[80%] text-sm">
              {progress.funded ? 'claimed' : 'raised'} of {progress.goal} {progress.currency}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
function Label({ company }: { company: Company }) {
  const funds = getFunds(company);
  const claims = getClaimed(company);
  const goal = Number(company.status.goal);
  const funded = funds >= goal;
  const actual = funded
    ? company.status.promises.reduce((prev, p) => prev + (p.claimed ? p.amount : 0.0), 0)
    : company.status.investments.reduce((prev, inv) => prev + inv.amount, 0);
  const progress = {
    goal: goal,
    actual: actual,
    currency: 'DAI',
    investors: Object.values(company.status.investments),
    funded: funded,
    completed: claims >= goal,
  };

  return (
    <div className={clsx('absolute bottom-0 left-0 flex w-full @container/label')}>
      <div className="flex items-center w-full border bg-white/70 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <div className="flex flex-row w-full">
          <div className="flex w-full flex-col p-4 lg:gap-1">
            <h3 className="text-xl mr-4 flex-grow pl-2 leading-none tracking-tight">
              {company.details?.name}
            </h3>
            <div className="text-sm mr-4 flex-grow pl-2 leading-none text-neutral-200">
              by {company.creator.ens ?? company.creator.address}
            </div>
          </div>
          <div className="flex shrink flex-col w-full p-4 lg:gap-1 pl-2 w-full self-right">
            <div className="tracking-tight">
              <div>
                <CompactProgressLabel progress={progress} />
              </div>
              <div>
                {progress.investors.length > 0 ? (
                  <div className="text-right">{progress.investors.length} investors</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyGridTile({ company }: { company: Company }) {
  return (
    <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black border-neutral-200 dark:border-neutral-800">
      {company.details?.image ? (
        <Image
          className={clsx(
            'relative h-full w-full object-containtransition duration-300 ease-in-out group-hover:scale-105',
          )}
          alt={company.details?.name ?? '<name>'}
          src={company.details?.image ?? ''}
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : null}
      <Label company={company} />
    </div>
  );
}

function CompanyGridItem({ company }: { company: Company }) {
  return (
    <>
      <Grid.Item key={company.projectId} className="animate-fadeIn rounded-lg truncate">
        <Link
          className="relative inline-block h-full w-full"
          href={`/company/${company.projectId}`}
        >
          <CompanyGridTile company={company} />
        </Link>
      </Grid.Item>
    </>
  );
}

export function CompaniesGrid({ companies }: { companies: Company[] }) {
  return (
    <div className="order-last w-full md:order-none">
      {companies.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, i) => (
            <CompanyGridItem company={company} key={i} />
          ))}
        </Grid>
      ) : null}
    </div>
  );
}

function FilterItem({ item }: { item: ListItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.has('q') ? searchParams.get('q') === item.path : item.path === '';
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? 'p' : Link;

  newParams.set('q', item.path);

  return (
    <>
      <li className="mt-2 flex text-sm text-black dark:text-white">
        <DynamicTag
          href={createUrl(pathname, newParams)}
          className={clsx('w-full hover:underline hover:underline-offset-4', {
            'underline underline-offset-4': active,
          })}
        >
          {item.title}
        </DynamicTag>
      </li>
    </>
  );
}

export function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <div className="order-none flex-none md:order-last md:w-[125px]">
        <nav>
          <h3 className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
            {title}
          </h3>
          <ul className="hidden md:block">
            {list.map((item: ListItem, i) => (
              <FilterItem item={item} key={i} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export type Filters = { title: string; items: ListItem[] };
export type ListItem = { title: string; path: string };
export function SortableGrid({ companies, filters }: { companies: Company[]; filters: Filters }) {
  const searchParams = useSearchParams();
  if (searchParams.has('q')) {
    const query = searchParams.get('q');
    if (query === 'progress') {
      companies = companies.sort(
        (c1: Company, c2: Company) =>
          c2.status.promises.reduce((prev, p) => prev + (p.claimed ? p.amount : 0.0), 0.0) /
            Number(c2.status.goal) -
          c1.status.promises.reduce((prev, p) => prev + (p.claimed ? p.amount : 0.0), 0.0) /
            Number(c1.status.goal),
      );
    } else if (query === 'goal') {
      companies = companies.sort(
        (c1: Company, c2: Company) => Number(c2.status.goal) - Number(c1.status.goal),
      );
    } else if (query === 'participation') {
      companies = companies.sort(
        (c1: Company, c2: Company) => c2.status.investments.length - c1.status.investments.length,
      );
    }
  }

  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black dark:text-white md:flex-row">
        <CompaniesGrid companies={companies} />
        {filters.items.length > 0 ? (
          <FilterList list={filters.items} title={filters.title} />
        ) : null}
      </div>
    </>
  );
}

export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};
