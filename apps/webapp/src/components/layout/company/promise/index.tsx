import { getClaimed, getFunds, isCreatorContext, isInvestorContext } from '@/lib';
import { Company } from '@/lib/types';
import { useAccount } from 'wagmi';
import { ActionsContext } from '../actions/types';
import { InvestorGoalView } from './investor';
import { CreatorGoalView } from './creator';
import { fromHex } from 'viem';

function AllClaimedGoals({ company }: { company: Company }) {
  const goals = company.status.promises;
  return (
    <div className="grid justify-items-start w-full pt-2">
      {goals.length > 0 ? (
        <div>
          <div className="dark:text-white/[80%]">Claimed goals:</div>
          <div>
            <ul className="list-disc pl-4">
              {goals.map((goal, i) => (
                <li className="font-light text-sm dark:text-white/[80%]" key={i}>
                  {fromHex(goal.text as any, 'string')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="dark:text-white/[80%]">Become the first investor! 🚀</div>
      )}
    </div>
  );
}

function Title() {
  return (
    <>
      <h1 className="mb-2 text-xl font-medium">Goal</h1>
    </>
  );
}

export function Goals({ context }: { context: ActionsContext }) {
  const { address } = useAccount();
  if (!address) {
    alert('hey');
    return <></>;
  }

  const company = context.company;
  const isCreator = isCreatorContext(address, company);
  const isInvestor = isInvestorContext(address, company);

  const funds = getFunds(company);
  const goal = Number(company.status.goal);
  const claimed = getClaimed(company);

  if (claimed >= goal) {
    return (
      <>
        <div className="h-full w-full py-4">
          <Title />
          <div>
            <AllClaimedGoals company={company} />
          </div>
        </div>
      </>
    );
  } else if (isInvestor) {
    return (
      <>
        <div className="h-full w-full py-4">
          <Title />
          <div>
            <InvestorGoalView context={context} />
          </div>
        </div>
      </>
    );
  } else if (isCreator) {
    return (
      <>
        <div className="h-full w-full py-4">
          <Title />
          <div>
            <CreatorGoalView context={context} />
          </div>
        </div>
      </>
    );
  } else if (funds < goal) {
    return <></>;
  } else {
    return <></>;
  }
}
