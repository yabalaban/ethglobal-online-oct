import clsx from 'clsx';

export function Section({ component }: { component: any }) {
  return (
    <>
      <div className={clsx('border-b dark:border-neutral-700 w-full')}>{component}</div>
    </>
  );
}
