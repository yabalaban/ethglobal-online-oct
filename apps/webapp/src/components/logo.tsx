import clsx from 'clsx';
import Image from 'next/image';
const logo = require('./icons/logo.png');

export default function Logo({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm',
        },
      )}
    >
      <Image src={logo} alt="" />
    </div>
  );
}
