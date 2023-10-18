import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function CompanyGridTile({
  isInteractive = true,
  active,
  company,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  company?: {
    title: string;
    description: string;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black',
        {
          relative: company,
          'border-2 border-blue-600': active,
          'border-neutral-200 dark:border-neutral-800': !active,
        },
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
          })}
          {...props}
        />
      ) : null}
      {company ? <Label title={company.title} description={company.description} /> : null}
    </div>
  );
}
