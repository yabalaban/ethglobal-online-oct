'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MenuItem({ item }: { item: any }) {
  const DynamicTag = !item.enabled ? 'p' : Link;
  const pathname = usePathname();
  const active = pathname == item.path;

  return (
    <li key={item.title}>
      <DynamicTag
        href={item.path}
        className={clsx('text-neutral-500', {
          'dark:text-neutral-600': !item.enabled,
          'dark:text-neutral-300': active,
        })}
        data-modal-target="defaultModal"
        data-modal-toggle="defaultModal"
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function Menu({ items }: { items: any[] }) {
  return (
    <>
      {items.length ? (
        <ul className="hidden gap-6 text-sm md:flex md:items-center">
          {items.map((item: any, i) => (
            <MenuItem item={item} key={i} />
          ))}
        </ul>
      ) : null}
    </>
  );
}
