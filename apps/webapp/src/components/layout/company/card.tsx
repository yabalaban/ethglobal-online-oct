'use client';

import { Company, Person } from '@/lib/cryptovc/types';
import clsx from 'clsx';
import React from 'react';

// Company details

function Name({ name }: { name: string }) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-medium">{name}</h1>
      </div>
    </>
  );
}

function Description({ description }: { description: string }) {
  return (
    <>
      <div>
        <div className="mb-6 dark:text-white/[80%]">
          <p className="text-sm break-words">{description}</p>
        </div>
      </div>
    </>
  );
}

function Info({ info }: { info: { name: string; description: string } }) {
  return (
    <>
      <Name name={info.name} />
      <Description description={info.description} />
    </>
  );
}

// Progress

export function ProgressLabel({
  progress,
  compact,
}: {
  progress: { actual: number; goal: number; currency: string };
  compact: boolean;
}) {
  return (
    <div className={clsx('flex flex-row lg:gap-1 items-baseline', { 'pb-4': !compact })}>
      <div>
        <p className={clsx('font-medium', { 'text-4xl': !compact, 'text-sm': compact })}>
          {progress.actual} {progress.currency}
        </p>
      </div>
      <div>
        <p
          className={clsx('font-light dark:text-white/[80%]', {
            'text-xl': !compact,
            'text-sm': compact,
          })}
        >
          raised of {progress.goal} {progress.currency}
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ ratio }: { ratio: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
      <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: ratio + '%' }}></div>
    </div>
  );
}

function ProgressInfo({ investors }: { investors: Person[] }) {
  return (
    <>
      <div className="grid justify-items-start w-full pt-2">
        {investors.length > 0 ? (
          <div>
            <div className="font-light text-sm">Funded by {investors.length} investors:</div>
            <div>
              <ul className="list-disc">
                {investors.map((investor, i) => (
                  <li className="font-light text-xs dark:text-white/[80%]" key={i}>
                    {investor.address}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>Become the first investor! 🚀🚀🚀</div>
        )}
      </div>
    </>
  );
}

function Progress({
  progress,
}: {
  progress: { actual: number; goal: number; currency: string; investors: Person[] };
}) {
  const ratio = Math.trunc((progress.actual / progress.goal) * 100);
  return (
    <div className="py-4">
      <ProgressLabel progress={progress} compact={false} />
      <ProgressBar ratio={ratio} />
      <ProgressInfo investors={progress.investors} />
    </div>
  );
}

// Actions

function ViewerActions({ company }: { company: Company }) {
  function handleSaveClick() {
    console.log('save', company);
  }
  function handlePromiseClick() {
    console.log('promise', company);
  }
  function handleInvestClick() {
    console.log('invest', company);
  }

  return (
    <div className="flex flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSaveClick}
      >
        Save
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handlePromiseClick}
      >
        Promise
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br active:ring-4 active:outline-none focus:outline-none active:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
        onClick={handleInvestClick}
      >
        Invest
      </button>
    </div>
  );
}

function InvestorActions({ company }: { company: Company }) {
  function handlePromiseClick() {
    console.log('promise', company);
  }
  function handleSafeClick() {
    console.log('safe', company);
  }
  function handleMessageClick() {
    console.log('message', company);
  }

  return (
    <div className="flex flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handlePromiseClick}
      >
        Promise
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSafeClick}
      >
        Safe
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleMessageClick}
      >
        Message
      </button>
    </div>
  );
}

function CreatorActions({ company }: { company: Company }) {
  function handlePromiseClick() {
    console.log('make promise', company);
  }
  function handleClaimClick() {
    console.log('claim', company);
  }
  function handleSendPushClick() {
    console.log('send push', company);
  }

  return (
    <div className="flex flex row lg:flex-row lg:gap-1">
      <button
        type="button"
        className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handlePromiseClick}
      >
        Make Promise
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleClaimClick}
      >
        Claim
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSendPushClick}
      >
        Send Push
      </button>
    </div>
  );
}

function Actions({
  context,
}: {
  context: { investor: boolean; creator: boolean; company: Company };
}) {
  const justViewer = !context.investor && !context.creator;
  return (
    <>
      <div className="h-full w-full basis-full py-4 grow">
        {justViewer ? <ViewerActions company={context.company} /> : null}
        {context.investor ? <InvestorActions company={context.company} /> : null}
        {context.creator ? <CreatorActions company={context.company} /> : null}
      </div>
    </>
  );
}

// Utils

function Section({ component }: { component: any }) {
  return (
    <>
      <div className={clsx('border-b dark:border-neutral-700 w-full')}>{component}</div>
    </>
  );
}

export function Card({ company }: { company: Company }) {
  // TODO: pass with context
  const creator = false;
  const investor = true;

  const info = {
    name: company.name,
    description: company.description,
  };
  const progress = {
    goal: company.goal,
    actual: company.progress,
    currency: company.currency,
    investors: company.investors,
  };
  const context = {
    investor: investor,
    creator: creator,
    company: company,
  };

  return (
    <>
      <div className="bg-white dark:border-neutral-900 shadow-xl dark:bg-neutral-800 rounded-lg border border-neutral-200 h-full w-full pb-4">
        <div className="flex flex-col lg:flex-col items-center justify-center px-8 py-4">
          <Section component={<Info info={info} />} />
          <Section component={<Progress progress={progress} />} />
          <Actions context={context} />
        </div>
      </div>
    </>
  );
}
