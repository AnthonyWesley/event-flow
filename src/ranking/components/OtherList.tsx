import Avatar from "../../components/Avatar";
import { InfoLine } from "../../components/InfoLine";
import ProgressBar from "../../components/ProgressBar";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";

interface OtherListProps {
  other: {
    id: string;
    name: string;
    email: string;
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
  return (
    <ul
      role="list"
      className={`h-20 w-full rounded-sm border-l-4 ${
        index === 0
          ? "border-yellow-400"
          : index === 1
            ? "border-gray-300"
            : index === 2
              ? "border-amber-800"
              : "border-transparent"
      } ${index % 2 === 0 ? "bg-[rgb(15,23,42)]" : "bg-[rgb(10,23,42)]"}`}
    >
      <li
        key={other.email}
        id={other.id}
        onClick={() => getId(other.id)}
        className="flex w-full items-center justify-between gap-1 hover:bg-[rgb(29,37,57)]"
      >
        <div className="m-auto flex items-center justify-between gap-2 py-2">
          <div className="flex w-12 justify-center border-r border-gray-500/40 text-2xl">
            <div className="flex">
              {index + 1} <p className="text-base">º</p>
            </div>
          </div>

          <Avatar name={other?.name} />
        </div>

        <div className="mr-2 w-full flex-auto">
          <div className="flex justify-between gap-2 font-semibold text-gray-50">
            <InfoLine
              label="Nome:"
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
      </li>
    </ul>
  );
}
