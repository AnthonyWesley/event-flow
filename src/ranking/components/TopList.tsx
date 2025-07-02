import Avatar from "../../components/Avatar";
import { InfoLine } from "../../components/InfoLine";
import ProgressBar from "../../components/ProgressBar";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { goalUtils } from "../../helpers/goalUtils";

interface TopListProps {
  topThree: {
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
  total: number;
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
  total,
  sellerGoal,
  currentProgress,
  isValueGoal,
  goalLabel,
}: TopListProps) {
  const goalColor = getGoalColor(currentProgress, sellerGoal);

  const positionMargin =
    {
      0: "mt-10",
      1: "mt-0",
      2: "mt-15",
    }[index] || "mt-10";

  const correctPosition =
    {
      0: total === 1 ? "1" : "2",
      1: "1",
      2: "3",
    }[index] || "";

  const line =
    typeof window !== "undefined" && window.innerWidth < 768 ? "col" : "line";

  const getMedalImage = (index: number, total: number) => {
    if (total === 1) return "/images/01.png";
    if (total === 2) return index === 1 ? "/images/01.png" : "/images/02.png";

    const map: Record<number, string> = {
      0: "/images/shield-02.svg",
      1: "/images/shield-01.svg",
      2: "/images/shield-03.svg",
    };
    return map[index] || "/images/shield-03.svg";
  };
  // const images = ["/images/02.png", "/images/01.png", "/images/03.png"];

  const ringClass =
    index === 1
      ? "ring-amber-300 shadow-[0_0_10px_#dfb005]"
      : index === 0
        ? "ring-slate-300 shadow-[0_0_10px_#c4cfda]"
        : index === 2
          ? "ring-amber-600 shadow-[0_0_10px_#d19449]"
          : "bg-slate-950";

  return (
    <section className="my-2 flex min-h-[330px] w-full items-start justify-center gap-1">
      <div
        onClick={() => getId(topThree?.id)}
        className={`shake-vertical relative flex flex-col items-center justify-between ${positionMargin}`}
      >
        {/* <div
          className={`hexagon-border w-28 bg-amber-300 drop-shadow-lg md:w-36 lg:w-46`}
        ></div> */}

        <img
          src={getMedalImage(index, total)}
          // src={images[index]}
          alt=""
          className="w-27 drop-shadow-lg md:w-36 lg:w-46"
        />

        <div className="absolute top-0 z-20 mt-2 flex w-full flex-col items-center justify-between gap-1 text-[8px] md:mt-4 md:text-sm lg:mt-6 lg:gap-4 lg:text-sm">
          <span className="text-base md:text-2xl lg:text-2xl">
            {correctPosition}º
          </span>
          <Avatar
            name={topThree?.name}
            image={topThree?.photo}
            className={`${ringClass}`}
          />

          <h1 className="w-25 text-center text-[12px] font-bold lg:text-base">
            {fieldFormatter.name(topThree?.name, "firstTwo")}
          </h1>
        </div>
        <div className="mt-1 w-full px-1">
          <InfoLine
            label="Meta:"
            value={(topThree && goalLabel) || 0}
            icon={!isValueGoal ? "iconoir:box-iso" : ""}
            line={isValueGoal ? line : "line"}
            size="sm"
            color={goalColor}
          />
          {topThree && (
            <ProgressBar
              total={(topThree && sellerGoal) || 0}
              current={(topThree && currentProgress) || 0}
            />
          )}

          <InfoLine
            label="Vendas:"
            value={(topThree && topThree?.totalSalesCount) || 0}
            icon="iconoir:box-iso"
            size="xs"
            color={!isValueGoal ? goalColor : ""}
          />
          <InfoLine
            label="Total"
            value={currencyFormatter.ToBRL(topThree?.totalSalesValue) ?? 0}
            line={line}
            size="xs"
            color={isValueGoal ? goalColor : ""}
          />
        </div>
      </div>
    </section>
  );
}
