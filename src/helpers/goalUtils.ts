import { GoalType } from "../event/services/eventService";
import { SellerOutputDto } from "../seller/services/sellerService";

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
};
