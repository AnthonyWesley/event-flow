import Avatar from "../../components/Avatar";
import { InfoLine } from "../../components/InfoLine";
import ProgressBar from "../../components/ProgressBar";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";

interface TopListProps {
  topThree: {
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

// const getBackgroundColor = (index: number) => {
//   const colors = [
//     "bg-gray-300 drop-shadow-gray-300/90",
//     "bg-amber-400 drop-shadow-amber-400/90",
//     "bg-amber-600 drop-shadow-amber-600/90",
//   ];
//   return colors[index] || "bg-gray-200";
// };

const getGoalColor = (currentProgress: number, sellerGoal: number) =>
  goalUtils.handleGoalAchieved(currentProgress, sellerGoal);

export default function TopThree({
  topThree,
  index,
  getId,
  sellerGoal,
  currentProgress,
  isValueGoal,
  goalLabel,
}: TopListProps) {
  const goalColor = getGoalColor(currentProgress, sellerGoal);

  const positionOrder =
    {
      0: "order-3",
      1: "order-1",
      2: "order-2",
    }[index] || "order-last";

  const positionMargin =
    {
      0: "mt-10",
      1: "mt-0",
      2: "mt-15",
    }[index] || "mt-10";

  const correctPosition =
    {
      0: "2",
      1: "1",
      2: "3",
    }[index] || "";

  const line =
    typeof window !== "undefined" && window.innerWidth < 768 ? "col" : "line";

  const images = ["/images/02.png", "/images/01.png", "/images/03.png"];
  return (
    <section className="my-5 flex h-full w-full items-end justify-center gap-1">
      <div
        onClick={() => getId(topThree?.id)}
        className={`shake-vertical relative flex flex-col ${positionOrder} items-center ${positionMargin}`}
      >
        {/* <div
          className={`hexagon-border w-28 drop-shadow-lg md:w-36 lg:w-46 ${getBackgroundColor(index)}`}
        ></div> */}

        <img
          src={images[index]}
          alt=""
          className="w-28 drop-shadow-lg md:w-36 lg:w-46"
        />

        <div className="absolute top-1/2 left-1/2 z-20 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center pb-20 text-[8px] md:text-sm lg:gap-4 lg:text-sm">
          <span className="text-base md:text-2xl lg:text-2xl">
            {correctPosition}º
          </span>

          <Avatar name={topThree?.name} className="lg:size-28" />

          <h1 className="mb-10 text-center text-sm font-bold">
            {topThree?.name?.split(" ").slice(0, 1).join(" ")}
          </h1>
        </div>
        <div className="mt-1">
          <InfoLine
            label="Meta:"
            value={goalLabel}
            icon={!isValueGoal ? "iconoir:box-iso" : ""}
            line={isValueGoal ? line : "line"}
            size="sm"
            color={goalColor}
          />
          <ProgressBar total={sellerGoal} current={currentProgress} />
          <InfoLine
            label="Vendas:"
            value={topThree?.totalSalesCount}
            icon="iconoir:box-iso"
            size="xs"
            color={!isValueGoal ? goalColor : ""}
          />
          <InfoLine
            label="Total"
            value={currencyFormatter.ToBRL(topThree?.totalSalesValue)}
            line={line}
            size="xs"
            color={isValueGoal ? goalColor : ""}
          />
        </div>
      </div>
    </section>
  );
}
