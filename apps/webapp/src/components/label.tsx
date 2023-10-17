import clsx from 'clsx';

const Label = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className={clsx('absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label')}>
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">{title}</h3>
        <div>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Label;
