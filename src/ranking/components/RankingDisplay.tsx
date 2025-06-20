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
  photo: string;
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
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const { openModal } = useModalStore();

  const reorderedTopThree = (() => {
    const sellers = event?.allSellers || [];
    if (sellers.length >= 3) return [sellers[1], sellers[0], sellers[2]];
    if (sellers.length === 2) return [sellers[1], sellers[0]];
    if (sellers.length === 1) return [sellers[0]];
    return sellers.slice(0, 3);
  })();

  const ranking = {
    WINNER: event.allSellers?.slice(0, 1),
    PODIUM: reorderedTopThree,
    OTHERS: event.allSellers?.slice(3),
    NORMAL: event.allSellers,
  };

  const isValueGoal = event.goalType === "VALUE";
  const sellerGoal = goalUtils?.calculateSellerGoal(
    event.allSellers,
    event.goal,
  );

  const handleClick = (id: string) => {
    setSelectedSellerId(id);
    openModal(id);
  };

  return (
    <>
      {ranking[mode]?.map((seller: SellersType, index: number) => {
        const currentProgress = isValueGoal
          ? seller.totalSalesValue
          : seller.totalSalesCount;
        const goalLabel = isValueGoal
          ? currencyFormatter.ToBRL(sellerGoal)
          : `${sellerGoal}`;

        const getId = !disable ? () => handleClick(seller.id) : () => {};

        if (mode === "OTHERS" || mode === "NORMAL") {
          return (
            <OtherList
              key={seller.email}
              other={seller}
              index={mode === "OTHERS" ? index + 3 : index}
              getId={getId}
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
              key={seller.id}
              topThree={seller}
              index={index}
              total={reorderedTopThree.length}
              getId={getId}
              sellerGoal={sellerGoal}
              currentProgress={currentProgress}
              isValueGoal={isValueGoal}
              goalLabel={goalLabel}
            />
          );
        }
      })}

      <Modal
        id={selectedSellerId ?? ""}
        info={event.allSellers.find((s) => s.id === selectedSellerId)?.name}
      >
        {selectedSellerId &&
          (() => {
            const seller = event.allSellers.find(
              (s) => s.id === selectedSellerId,
            );
            if (!seller) return null;

            const currentProgress = isValueGoal
              ? seller.totalSalesValue
              : seller.totalSalesCount;
            const goalLabel = isValueGoal
              ? currencyFormatter.ToBRL(sellerGoal)
              : `${sellerGoal}`;
            const index =
              event.allSellers.findIndex((s) => s.id === seller.id) + 1;

            return (
              <SellerDetailByEvent
                key={seller.email}
                index={index}
                seller={seller}
                event={event}
                sellerGoal={sellerGoal}
                currentProgress={currentProgress}
                isValueGoal={isValueGoal}
                goalLabel={goalLabel}
              />
            );
          })()}
      </Modal>
    </>
  );
}
