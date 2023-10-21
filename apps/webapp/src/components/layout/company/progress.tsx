import { getClaimed, getFunds } from '@/lib';
import { Company, Person } from '@/lib/types';
import { etherscanLink } from '@/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export function ProgressLabel({
  progress,
  compact,
}: {
  progress: { actual: number; goal: number; currency: string; funded: boolean; completed: boolean };
  compact: boolean;
}) {
  return (
    <div>
      {progress.completed ? (
        <div className="flex flex-col lg:gap-1 items-baseline">
          <div className="">
            <h1 className="text-2xl font-medium">Seed round is over! 🎉</h1>
          </div>
          <div className="dark:text-white/[80%]">
            <p className="break-words">
              Total funds: {progress.goal} {progress.currency}
            </p>
          </div>
        </div>
      ) : (
        <div className={clsx('flex flex-row lg:gap-1 items-baseline', { 'pb-4': !compact })}>
          <div>
            <p className={clsx('font-medium', { 'text-3xl': !compact, 'text-sm': compact })}>
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
              {progress.funded ? 'claimed' : 'raised'} of {progress.goal} {progress.currency}
            </p>
          </div>
        </div>
      )}
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
            <div className="dark:text-white/[80%]">Baked by:</div>
            <div>
              <ul className="list-disc pl-4">
                {investors.map((investor, i) => (
                  <li className="font-light text-sm dark:text-white/[80%]" key={i}>
                    <Link href={etherscanLink(investor.address)} className="" target="_blank">
                      {investor.address}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="dark:text-white/[80%]">Become the first investor! 🚀</div>
        )}
      </div>
    </>
  );
}

export function Progress({ company }: { company: Company }) {
  const { address } = useAccount();
  if (!address) {
    alert('hey');
    return <></>;
  }

  const funds = getFunds(company);
  const goal = Number(company.status.goal);
  const fundsRatio = Math.trunc((funds / Number(goal)) * 100);
  const claimed = getClaimed(company);
  const claimedRatio = Math.trunc((claimed / Number(goal)) * 100);

  const funded = funds >= goal;
  const completed = claimed >= goal;

  const ratio = funded ? claimedRatio : fundsRatio;
  const investors = company.status.investments.map((inv) => inv.investor);
  const actual = funded ? claimed : funds;

  const progress = {
    actual: actual,
    goal: goal,
    currency: 'DAI',
    funded: funded,
    completed: completed,
  };

  return (
    <div className="py-4">
      <ProgressLabel progress={progress} compact={false} />
      {!completed ? <ProgressBar ratio={ratio} /> : null}
      <ProgressInfo investors={investors} />
    </div>
  );
}
