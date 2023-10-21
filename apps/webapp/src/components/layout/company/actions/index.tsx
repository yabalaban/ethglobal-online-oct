import { getClaimed, getFunds, isCreatorContext, isInvestorContext } from '@/lib';
import { Company } from '@/lib/types';
import { useAccount } from 'wagmi';
import { InvestorActions } from './investor';
import { CreatorActions } from './creator';
import { ViewerActions } from './viewer';

export function Actions({ company }: { company: Company }) {
  const { address } = useAccount();
  if (!address) {
    alert('hey');
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
  };

  return (
    <>
      <div className="h-full w-full basis-full py-4 grow">
        {isViewer ? <ViewerActions context={context} /> : null}
        {isInvestor ? <InvestorActions context={context} /> : null}
        {isCreator ? <CreatorActions context={context} /> : null}
      </div>
    </>
  );
}
