import { PropsWithChildren } from 'react';

interface ModalProps {
  title: string;
}

export function Modal({ children, title }: PropsWithChildren<ModalProps>) {
  return (
    <>
      <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full backdrop-blur ">
        <div className="max-w-md">
          <div className="h-full w-full rounded-md p-4 dark:text-white dark:border-neutral-600 shadow-xl dark:bg-neutral-800 rounded-lg">
            <p className="text-2xl font-medium mb-4">{title}</p>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
