import FlexSection from "../../components/FlexSection";
import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import SaleList from "../../sale/components/SaleList";
import { useEvent } from "../../event/hooks/useEvent";
import useProduct from "../../product/hooks/useProduct";
import useSeller from "../../seller/hooks/useSeller";
import SellerForm from "../../seller/components/SellerForm";
import SaleForm from "../../sale/components/SaleForm";
import Modal from "../../components/Modal";
import Avatar from "../../components/Avatar";
import { goalUtils } from "../../helpers/goalUtils";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { CircularProgress } from "../../components/CircularProgress";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SellerOutputDto } from "../../seller/services/sellerService";
import { SaleOutputDto } from "../../sale/services/saleService";
import RankingDisplay from "../../ranking/components/RankingDisplay";

export default function GuestPage() {
  // const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  const [isReady, setIsReady] = useState(false);
  const { sellerId } = useParams<{ sellerId: string }>();
  const [searchParams] = useSearchParams();
  const partnerToken = searchParams.get("partnerToken");

  const {
    querySeller: { data: seller, isLoading: isSellerLoading, error },
  } = useSeller(sellerId);

  const {
    currentEvent,
    queryEvents: { isLoading: isEventLoading },
  } = useEvent();

  const {
    queryProducts: { data: products },
  } = useProduct();

  useEffect(() => {
    if (partnerToken) sessionStorage.setItem("accessToken", partnerToken);
    setIsReady(true);
  }, [partnerToken]);

  const allSalesBySeller = currentEvent?.sales.filter(
    (sa: SaleOutputDto) => sa.sellerId === sellerId,
  );

  const goal = goalUtils.calculateSellerGoal(
    currentEvent?.allSellers,
    currentEvent?.goal ?? 0,
  );
  const isValueGoal = currentEvent?.goalType === "VALUE";

  if (!isReady) return <Spin />;

  if (isSellerLoading) return <Spin />;
  if (isEventLoading) return <Spin />;
  if (error) return "An error has occurred: " + error.message;
  const currentSeller = currentEvent?.allSellers.filter(
    (se: SellerOutputDto) => se?.id === sellerId,
  );

  const currentProgress = isValueGoal
    ? currentSeller[0]?.totalSalesValue
    : currentSeller[0]?.totalSalesCount;
  const goalLabel = isValueGoal ? currencyFormatter.ToBRL(goal) : `${goal}`;

  return (
    <div className="flex flex-col">
      <FlexSection className="flex-row gap-2 bg-slate-900">
        <Avatar name={seller?.name} />
        <div className="flex w-full flex-col items-start justify-evenly lg:flex-row">
          <InfoLine
            value={seller?.name?.split(" ").slice(0, 2).join(" ")}
            size="base"
          />
          <InfoLine label="E-mail:" value={seller.email} size="sm" />
          <InfoLine label="Telefone:" value={seller.phone} size="sm" />
        </div>
        <Modal id="GuestPageSellerForm" icon="carbon:edit">
          <SellerForm seller={seller} />
        </Modal>
      </FlexSection>
      <FlexSection className="flex-row bg-slate-900">
        <InfoLine
          label="Evento"
          value={currentEvent?.name}
          size="lg"
          line="col"
        />
        <div className="flex w-20 items-start justify-center border-r border-l border-gray-500/25 pl-2 text-4xl">
          <h1>
            {currentEvent.allSellers.findIndex(
              (s: any) => s.name === seller.name,
            ) + 1}
          </h1>
          <p className="text-base">º</p>
        </div>
        <Modal id="GuestPageSaleForm" icon="carbon:shopping-cart-plus">
          <SaleForm eventId={currentEvent?.id} guestId={sellerId} isGuest />
        </Modal>
      </FlexSection>
      <FlexSection className="my-2 flex-row justify-start border-t border-b border-gray-400/15">
        {/* <InfoLine label="Vendas:" value={event?.name} /> */}
        <CircularProgress
          total={goal}
          current={currentProgress}
          // color={goalColor}
        />
        <FlexSection className="items-start">
          <InfoLine
            label="Meta:"
            value={goalLabel}
            icon={!isValueGoal ? "iconoir:box-iso" : ""}
            // color={goalColor}
          />

          <InfoLine
            label="Vendas:"
            value={currentSeller[0]?.totalSalesCount}
            icon="iconoir:box-iso"
            // color={!isValueGoal ? goalColor : ""}
          />

          <InfoLine
            label="Total:"
            value={currencyFormatter.ToBRL(currentSeller[0]?.totalSalesValue)}
            // color={isValueGoal ? goalColor : ""}
          />
        </FlexSection>
      </FlexSection>

      <div className={`w-full lg:flex`}>
        <div className="w-full rounded-sm border-t-4 border-b-4 border-rose-500 bg-slate-900/50">
          <h1 className="bg-rose-500 p-2">Minhas vendas</h1>
          <div className="h-[35vh] overflow-y-scroll lg:h-[45vh]">
            <SaleList
              sales={allSalesBySeller}
              sellers={currentEvent.allSellers}
              products={products}
              isGuest
            />
          </div>
        </div>
        <span className="p-2"></span>
        <div className="pointer-events-none w-full rounded-sm border-t-4 border-b-4 border-cyan-800 bg-slate-900/50">
          <h1 className="bg-cyan-800 p-2">Rankig</h1>
          <div className="pointer-events-auto h-[35vh] overflow-y-scroll lg:h-[45vh]">
            <RankingDisplay event={currentEvent} disable />
          </div>
        </div>
      </div>
    </div>
  );
}
