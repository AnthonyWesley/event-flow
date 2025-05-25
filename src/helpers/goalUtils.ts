import { GoalType } from "../event/services/eventService";
import { SellerOutputDto } from "../seller/services/sellerService";
const podiumColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};
export const goalUtils = {
  handleGoalAchieved: (currentTotal: number, goal: number): string => {
    return currentTotal >= goal ? "#22d3ee" : "";
  },

  getTotalForGoal: (allSellers: any[], goalType: GoalType): number => {
    return allSellers?.reduce(
      (acc, seller) =>
        acc +
        (goalType === "VALUE"
          ? seller.totalSalesValue
          : seller.totalSalesCount),
      0,
    );
  },

  calculateSellerGoal: (
    allSellers: SellerOutputDto[],
    goal: number,
  ): number => {
    return Math.ceil(goal / allSellers?.length);
  },
  podiumColor: (index: number) => podiumColors[index] || "text-gray-300",
};
