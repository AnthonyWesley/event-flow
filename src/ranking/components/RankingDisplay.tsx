import { useState } from "react";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { EventOutputDto } from "../../event/services/eventService";
import { goalUtils } from "../../helpers/goalUtils";
import OtherList from "./OtherList";
import TopList from "./TopList";
import SellerDetailByEvent from "../../seller/components/SellerDetailByEvent";
import Modal from "../../components/Modal";
import { useModalStore } from "../../store/useModalStore";

export type SellersType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSalesCount: number;
  totalSalesValue: number;
};

type PodiumProps = {
  event: EventOutputDto;
  mode?: Mode;
  disable?: boolean;
};

type Mode = "WINNER" | "PODIUM" | "OTHERS" | "NORMAL";

export default function RankingDisplay({
  event,
  mode = "NORMAL",
  disable = false,
}: PodiumProps) {
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const { openModal } = useModalStore();

  const reorderedTopThree = (() => {
    const sellers = event?.allSellers || [];
    if (sellers.length >= 3) return [sellers[1], sellers[0], sellers[2]];
    return sellers.slice(0, 3);
  })();

  const ranking = {
    WINNER: event.allSellers?.slice(0, 1),
    PODIUM: reorderedTopThree,
    OTHERS: event.allSellers?.slice(3),
    NORMAL: event.allSellers,
  };

  const isValueGoal = event.goalType === "VALUE";

  return (
    <>
      {ranking[mode]?.map((seller: SellersType, index: number) => {
        const sellerGoal = goalUtils?.calculateSellerGoal(
          event.allSellers,
          event.goal,
        );
        const currentProgress = isValueGoal
          ? seller?.totalSalesValue
          : seller?.totalSalesCount;
        const goalLabel = isValueGoal
          ? currencyFormatter.ToBRL(sellerGoal)
          : `${sellerGoal}`;

        const handleClick = () => {
          setSelectedSeller({
            ...seller,
            index,
            sellerGoal,
            currentProgress,
            goalLabel,
          });
          openModal(seller.id);
        };

        if (mode === "OTHERS") {
          return (
            <OtherList
              key={seller?.email}
              other={seller}
              index={index + 3}
              getId={!disable ? handleClick : () => {}}
              sellerGoal={sellerGoal}
              currentProgress={currentProgress}
              isValueGoal={isValueGoal}
              goalLabel={goalLabel}
            />
          );
        }

        if (mode === "NORMAL") {
          return (
            <OtherList
              key={seller?.email}
              other={seller}
              index={index}
              getId={!disable ? handleClick : () => {}}
              sellerGoal={sellerGoal}
              currentProgress={currentProgress}
              isValueGoal={isValueGoal}
              goalLabel={goalLabel}
            />
          );
        }

        if (mode === "PODIUM" && event?.sales.length > 0) {
          return (
            <TopList
              key={index}
              topThree={seller}
              index={index}
              getId={!disable ? handleClick : () => {}}
              sellerGoal={sellerGoal}
              currentProgress={currentProgress}
              isValueGoal={isValueGoal}
              goalLabel={goalLabel}
            />
          );
        }
      })}

      <Modal id={selectedSeller?.id} info={selectedSeller?.name}>
        {selectedSeller && (
          <SellerDetailByEvent
            key={selectedSeller.email}
            index={
              event.allSellers.findIndex(
                (s) => s.name === selectedSeller.name,
              ) + 1
            }
            seller={selectedSeller}
            event={event}
            sellerGoal={selectedSeller.sellerGoal}
            currentProgress={selectedSeller.currentProgress}
            isValueGoal={isValueGoal}
            goalLabel={selectedSeller.goalLabel}
          />
        )}
      </Modal>
    </>
  );
}
