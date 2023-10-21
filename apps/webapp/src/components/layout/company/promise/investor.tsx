import { getCurrentGoal } from '@/lib';
import { ActionsContext } from '../actions/types';

function NoGoal() {
  return (
    <>
      <div className="text-sm dark:text-white/[80%]">
        There is no goal set yet, nudge the creator by sending the message below!
      </div>
    </>
  );
}

export function InvestorGoalView({ context }: { context: ActionsContext }) {
  const current = getCurrentGoal(context.company);

  if (!current) {
    return <NoGoal />;
  }
  return <></>;
}
