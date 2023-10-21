import { getClaimed, getFunds, isCreatorContext, isInvestorContext } from '@/lib';
import { Company } from '@/lib/types';
import { useAccount } from 'wagmi';
import { InvestorActions } from './investor';
import { CreatorActions } from './creator';
import { ViewerActions } from './viewer';

export function Actions({
  company,
  onModifyAction,
}: {
  company: Company;
  onModifyAction: () => void;
}) {
  const { address } = useAccount();
  if (!address) {
    return <></>;
  }
  console.log(company);

  const funds = getFunds(company);
  const goal = Number(company.status.goal);
  const claimed = getClaimed(company);
  const isCreator = isCreatorContext(address, company);
  const isInvestor = isInvestorContext(address, company);
  const isViewer = !(isCreator || isInvestor);

  const funded = funds >= goal;
  const completed = claimed >= goal;

  const context = {
    company: company,
    funded: funded,
    completed: completed,
    onModifyAction: onModifyAction,
  };

  return (
    <>
      <div className="h-full w-full py-4">
        {isViewer ? <ViewerActions context={context} /> : null}
        {isInvestor ? <InvestorActions context={context} /> : null}
        {isCreator ? <CreatorActions context={context} /> : null}
      </div>
    </>
  );
}
