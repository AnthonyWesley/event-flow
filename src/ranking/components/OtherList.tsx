import Avatar from "../../components/Avatar";
import Card from "../../components/Card";
import { InfoLine } from "../../components/InfoLine";
import ProgressBar from "../../components/ProgressBar";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";

interface OtherListProps {
  other: {
    id: string;
    name: string;
    email: string;
    photo: string;
    totalSalesCount: number;
    totalSalesValue: number;
  };
  index: number;
  getId: (id: string) => void;
  sellerGoal: number;
  currentProgress: number;
  isValueGoal: boolean;
  goalLabel: string;
}

export default function OtherList({
  other,
  index,
  getId,
  sellerGoal,
  currentProgress,
  isValueGoal,
  goalLabel,
}: OtherListProps) {
  const bgClass =
    index === 0
      ? "bg-gold"
      : index === 1
        ? "bg-silver"
        : index === 2
          ? "bg-bronze"
          : "bg-slate-950";

  const ringClass =
    index === 0
      ? "ring-amber-300"
      : index === 1
        ? "ring-slate-300"
        : index === 2
          ? "ring-amber-700"
          : "bg-slate-950";
  return (
    <Card
      className={`border-b border-gray-500/15 pl-1 ring-amber-300 hover:bg-[rgb(29,37,57)] ${bgClass}`}
      hover="hover:bg-[rgb(29,37,57)]"
    >
      <section
        key={other.email}
        id={other.id}
        onClick={() => getId(other.id)}
        className="flex w-full items-center justify-between gap-1"
      >
        <div className="m-auto flex items-center justify-between gap-2 py-2">
          <div className="flex w-12 justify-center border-r border-gray-500/40 text-2xl">
            <div className="flex">
              {index + 1} <p className="text-base">º</p>
            </div>
          </div>
          <div className="w-16">
            <Avatar
              name={other?.name}
              image={other?.photo}
              className={`${ringClass}`}
              size="size-16"
            />
          </div>
        </div>

        <div className="mr-2 w-full flex-auto">
          <div className="flex justify-between gap-2 font-semibold text-gray-50">
            <InfoLine
              value={other.name?.split(" ").slice(0, 1).join(" ")}
              color=""
              size="sm"
            />
            <InfoLine
              size="sm"
              label="Meta:"
              value={goalLabel}
              icon={!isValueGoal ? "iconoir:box-iso" : ""}
              color={goalUtils.handleGoalAchieved(currentProgress, sellerGoal)}
            />
          </div>

          <ProgressBar total={sellerGoal} current={currentProgress} />

          <div
            className={`flex justify-between gap-2 text-gray-50 ${
              !isValueGoal ? "flex-row-reverse" : ""
            }`}
          >
            <InfoLine
              size="sm"
              label="Total:"
              value={other.totalSalesCount}
              icon="iconoir:box-iso"
              color={
                !isValueGoal
                  ? goalUtils.handleGoalAchieved(currentProgress, sellerGoal)
                  : ""
              }
            />

            <InfoLine
              size="sm"
              label="Total:"
              value={currencyFormatter.ToBRL(other.totalSalesValue)}
              color={
                isValueGoal
                  ? goalUtils.handleGoalAchieved(currentProgress, sellerGoal)
                  : ""
              }
            />
          </div>
        </div>
      </section>
    </Card>
  );
}
