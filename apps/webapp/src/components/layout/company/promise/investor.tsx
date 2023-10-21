import Link from 'next/link';
import { getCurrentGoal } from '@/lib';
import { ActionsContext } from '../actions/types';
import { Address, fromHex } from 'viem';
import { UmaPromise } from '@/lib/types';

function NoGoal(safeAddress: { safeAddress: Address }) {
  const safeLink = 'https://app.safe.global/transactions/queue?safe=gor:' + safeAddress!;
  return (
    <>
      <div className="flex flex-col lg:flex-col lg:gap-4">
        <div className="text-sm dark:text-white/[80%]">
          There is no goal accepted yet, nudge the creator by sending the message below!
        </div>
        <div className="hover:underline self-center text-sm text-neutral-400 ">
          <Link href={safeLink} className="" target="_blank">
            Safe
          </Link>
        </div>
      </div>
    </>
  );
}

function SettleGoal({ claim }: { claim: UmaPromise }) {
  return (
    <div className="flex flex-col lg:flex-col lg:gap-1 w-full">
      <div className="text-sm dark:text-white/[80%]">{fromHex(claim.text as any, 'string')}</div>
      <div className="hover:underline self-center text-blue-600 ">
        <Link href={'https://testnet.oracle.uma.xyz/'} className="" target="_blank">
          Settle
        </Link>
      </div>
    </div>
  );
}

export function InvestorGoalView({ context }: { context: ActionsContext }) {
  const current = getCurrentGoal(context.company);

  if (!current) {
    return <NoGoal safeAddress={context.company.status.safe} />;
  } else {
    return <SettleGoal claim={current} />;
  }
}
