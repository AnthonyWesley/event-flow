import FlexSection from "../../components/FlexSection";
import Spin from "../../components/Spin";
import SaleList from "../../sale/components/SaleList";
import useProduct from "../../product/hooks/useProduct";
import SellerForm from "../../seller/components/SellerForm";
import SaleForm from "../../sale/components/SaleForm";
import Modal from "../../components/Modal";
import Avatar from "../../components/Avatar";
import RankingDisplay from "../../ranking/components/RankingDisplay";
import { InfoLine } from "../../components/InfoLine";
import { useEvent } from "../../event/hooks/useEvent";
import { goalUtils } from "../../helpers/goalUtils";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { CircularProgress } from "../../components/CircularProgress";
import { useParams } from "react-router-dom";
import useGuest from "../hooks/useGuest";
import { useEffect } from "react";

export default function GuestPage() {
  // const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  // const [isReady, setIsReady] = useState(false);
  const { eventId, sellerId } = useParams<{
    eventId: string;
    sellerId: string;
  }>();
  // const [searchParams] = useSearchParams();

  const {
    queryGuest: { data: seller, isLoading: isSellerLoading, error },
  } = useGuest(eventId ?? "", sellerId ?? "");
  const {
    currentEvent,
    queryEvents: { isLoading: isEventLoading },
  } = useEvent();

  const {
    queryProducts: { data: products, isLoading: isProductLoading },
  } = useProduct();

  // useEffect(() => {
  //   sessionStorage.setItem("accessToken", seller.token.accessToken);
  //   setIsReady(true);
  // }, []);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      sessionStorage.setItem("accessToken", token);
    }
  }, []);

  if (isEventLoading) return <Spin />;
  if (isProductLoading) return <Spin />;
  if (isSellerLoading) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const isValueGoal = currentEvent?.goalType === "VALUE";
  const currentProgress =
    seller?.guest?.[isValueGoal ? "totalSalesValue" : "totalSalesCount"];
  const goal = goalUtils.calculateSellerGoal(
    currentEvent?.allSellers,
    currentEvent?.goal ?? 0,
  );
  const goalLabel = isValueGoal ? currencyFormatter.ToBRL(goal) : `${goal}`;
  const goalColor = goalUtils.handleGoalAchieved(currentProgress, goal);

  return (
    <div className="flex flex-col">
      <FlexSection className="flex-row gap-2 bg-slate-900">
        <Avatar name={seller?.guest?.name} />
        <div className="flex w-full flex-col items-start justify-evenly lg:flex-row">
          <InfoLine
            value={seller?.guest?.name?.split(" ").slice(0, 2).join(" ")}
            size="base"
          />
          <InfoLine label="E-mail:" value={seller?.guest.email} size="sm" />
          <InfoLine label="Telefone:" value={seller?.guest.phone} size="sm" />
        </div>
        <Modal id="GuestPageSellerForm" icon="carbon:edit">
          <SellerForm seller={seller?.guest} />
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
            {currentEvent?.allSellers?.findIndex(
              (s: any) => s.name === seller?.guest?.name,
            ) + 1}
          </h1>
          <p className="text-base">º</p>
        </div>
        <Modal id="GuestPageSaleForm" icon="carbon:shopping-cart-plus">
          <SaleForm eventId={currentEvent?.id} guestId={sellerId} isGuest />
        </Modal>
      </FlexSection>
      <FlexSection className="my-2 flex-row justify-start border-t border-b border-gray-400/15">
        <CircularProgress total={goal} current={currentProgress} />
        <FlexSection className="items-start">
          <InfoLine
            label="Meta:"
            value={goalLabel}
            icon={!isValueGoal ? "iconoir:box-iso" : ""}
            color={goalColor}
          />

          <InfoLine
            label="Vendas:"
            value={seller?.guest?.totalSalesCount}
            icon="iconoir:box-iso"
            color={!isValueGoal ? goalColor : ""}
          />

          <InfoLine
            label="Total:"
            value={currencyFormatter.ToBRL(seller?.guest?.totalSalesValue)}
            color={goalColor}
          />
        </FlexSection>
      </FlexSection>

      <div className={`w-full lg:flex`}>
        <div className="w-full rounded-sm border-t-4 border-b-4 border-rose-500 bg-slate-900/50">
          <h1 className="bg-rose-500 p-2">Minhas vendas</h1>
          <div className="h-[35vh] overflow-y-scroll lg:h-[45vh]">
            <SaleList
              sales={seller.guest.sales}
              sellers={currentEvent?.allSellers}
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
