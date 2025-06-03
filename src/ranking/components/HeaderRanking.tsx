import ProgressBar from "../../components/ProgressBar";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { InfoLine } from "../../components/InfoLine";
import { goalUtils } from "../../helpers/goalUtils";

import { useEffect, useState } from "react";
import GoalAchievedModal from "../../components/GoalAchievedModal";
export type HeaderRankingProps = {
  event: any;
  className?: string;
};
export default function HeaderRanking({
  event,
  className,
}: HeaderRankingProps) {
  const [showModal, setShowModal] = useState(false);

  // function handleGoalAchieved() {
  //   // const total = goalUtils.getTotalForGoal(event.allSellers, event.goalType);

  //   playSong(victory);
  //   confetti({
  //     particleCount: 100,
  //     spread: 80,
  //     origin: { y: 0.6 },
  //   });
  //   setShowModal(true);
  // }

  useEffect(() => {
    // handleGoalAchieved();
  }, []);

  return (
    <header
      className={`my-1 flex w-full flex-col items-center gap-1 rounded-xl border border-gray-500/15 p-4 ${className}`}
    >
      {showModal && <GoalAchievedModal onClose={() => setShowModal(false)} />}
      <div className={`flex w-full items-center justify-between gap-1`}>
        <InfoLine label="Evento:" value={event?.name} />
        <InfoLine
          label="Meta:"
          value={
            event.goalType == "VALUE"
              ? currencyFormatter.ToBRL(event.goal)
              : event.goal + "unid"
          }
          color={goalUtils.handleGoalAchieved(
            goalUtils.getTotalForGoal(event.allSellers, event.goalType),
            event?.goal,
          )}
        />
      </div>

      <ProgressBar
        total={event?.goal}
        current={goalUtils.getTotalForGoal(event.allSellers, event.goalType)}
      />

      <div className="flex w-full justify-between gap-2 font-semibold text-gray-50">
        <InfoLine
          label="Total:"
          value={
            event.goalType == "VALUE"
              ? currencyFormatter.ToBRL(
                  goalUtils.getTotalForGoal(event.allSellers, event.goalType),
                )
              : goalUtils.getTotalForGoal(event.allSellers, event.goalType)
          }
          color={goalUtils.handleGoalAchieved(
            goalUtils.getTotalForGoal(event.allSellers, event.goalType),
            event?.goal,
          )}
        />
      </div>
    </header>
  );
}
