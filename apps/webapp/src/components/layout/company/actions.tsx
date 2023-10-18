'use client';

import { Company, Person } from '@/lib/cryptovc/types';
import { Progress } from '@material-tailwind/react';
import clsx from 'clsx';

function FundingProgress({ goal, progress }: { goal: number; progress: number }) {
  const ratio = Math.trunc((progress / goal) * 100);
  return (
    <>
      <div>
        {progress} ETH raised of {goal} ETH target
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ratio + '%' }}></div>
      </div>
    </>
  );
}

function InvestorList({ investors }: { investors: Person[] }) {
  return (
    <>
      <div>{investors.length} investors</div>
    </>
  );
}

function ViewerActions() {
  return (
    <button
      type="button"
      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      Invest
    </button>
  );
}

function CreatorActions() {
  return (
    <div>
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Claim
      </button>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Publish Promise
      </button>
    </div>
  );
}

function InvestorActions() {
  return (
    <div>
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Open Safe
      </button>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Assess Promise
      </button>
    </div>
  );
}

export function CompanyActions({ company, viewer }: { company: Company; viewer: Person }) {
  //   const creator = company.creator.address === viewer.address;
  const creator = true;
  //   const investor = company.investors.find((inv) => inv.address === viewer.address);
  const investor = false;

  return (
    <>
      <div className="bg-white dark:border-neutral-800 dark:bg-black/[20%] rounded-lg border border-neutral-200 h-full w-full ">
        <div className="flex flex-row lg:flex-col lg:gap-8 items-center justify-center ">
          <FundingProgress goal={company.goal} progress={company.progress} />
          <InvestorList investors={company.investors} />
          {!creator && !investor ? <ViewerActions /> : null}
          {creator ? <CreatorActions /> : null}
          {investor ? <InvestorActions /> : null}
        </div>
      </div>
    </>
  );
}
