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
import Accordion from "../../components/Accordion";
import InfoList from "../../components/InfoList";

export default function GuestPage() {
  const { eventId, sellerId } = useParams<{
    eventId: string;
    sellerId: string;
  }>();

  const {
    queryGuest: { data: seller, isLoading: isSellerLoading, error },
  } = useGuest(eventId ?? "", sellerId ?? "");
  const {
    queryEvent: { data: event, isLoading: isEventLoading },
  } = useEvent(eventId);

  const {
    queryProducts: { data: products, isLoading: isProductLoading },
  } = useProduct();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    console.log(token);

    if (token) {
      localStorage.setItem("accessToken", token);
    }
  }, []);

  if (isEventLoading) return <Spin />;
  if (isProductLoading) return <Spin />;
  if (isSellerLoading) return <Spin />;
  // if (error) return "An error has occurred: " + error.message;
  const currentIndex = Array.isArray(event?.allSellers)
    ? event.allSellers.findIndex((s: any) => s.name === seller?.guest?.name) + 1
    : "-";

  const isValueGoal = event?.goalType === "VALUE";
  const currentProgress =
    seller?.guest?.[isValueGoal ? "totalSalesValue" : "totalSalesCount"];
  const goal = goalUtils.calculateSellerGoal(
    event?.allSellers,
    event?.goal ?? 0,
  );
  const goalLabel = isValueGoal ? currencyFormatter.ToBRL(goal) : `${goal}`;
  const goalColor = goalUtils.handleGoalAchieved(currentProgress, goal);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Participante não encontrado</h1>
          <p className="text-lg">
            Esse evento pode ter sido removido ou o link está incorreto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <FlexSection className="flex-row gap-2 rounded-lg bg-slate-900">
        <Avatar name={seller?.guest?.name} />

        <div className="flex w-full flex-col items-start justify-evenly lg:flex-row">
          <Accordion
            title={
              <div className="flex w-full">
                <InfoLine
                  label="Convidado:"
                  value={seller?.guest?.name?.split(" ").slice(0, 2).join(" ")}
                  size="base"
                  line="col"
                />
                <div className="ml-auto flex w-20 items-start justify-center border-gray-500/25 pl-2 text-4xl">
                  <h1 className={`${goalUtils.podiumColor(currentIndex)}`}>
                    {currentIndex}
                  </h1>

                  <p
                    className={`text-base ${goalUtils.podiumColor(currentIndex)}`}
                  >
                    º
                  </p>
                </div>
              </div>
            }
            // icon="..."
            content={
              <>
                <InfoLine
                  label="E-mail:"
                  value={seller?.guest.email}
                  size="sm"
                  line="col"
                />
                <InfoLine
                  label="Telefone:"
                  value={seller?.guest.phone}
                  size="sm"
                  line="col"
                />
              </>
            }
          />
        </div>
      </FlexSection>

      <InfoLine label="Evento:" value={event?.name} />
      <FlexSection className="flex-row gap-2 rounded-lg bg-slate-900">
        <FlexSection className="w-full items-start justify-start">
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
        <CircularProgress total={goal} current={currentProgress} />
      </FlexSection>

      <section className="flex w-full flex-col rounded-lg lg:flex-row">
        <div className="mb-2 w-full rounded-lg bg-slate-900 lg:mr-2">
          <Accordion
            title={
              <InfoList
                tittle="Vendas"
                icon="mi:shopping-cart"
                length={event?.sales?.length}
                className="mx-4 w-full rounded-t-2xl border-b border-gray-500/15 py-4"
              />
            }
            content={
              event?.sales.length > 0 && (
                <div className="max-h-[35vh] overflow-y-scroll border-r border-gray-500/15 lg:h-[45vh]">
                  <SaleList
                    sales={seller?.guest?.sales}
                    sellers={event?.allSellers}
                    products={products}
                    isGuest
                  />
                </div>
              )
            }
          />
        </div>

        <div className="mb-2 w-full rounded-lg bg-slate-900">
          <Accordion
            title={
              <InfoList
                tittle="Rankig"
                icon="game-icons:podium-winner"
                length={event?.allSellers?.length}
                className="mx-4 w-full rounded-t-2xl border-b border-gray-500/15 py-4"
              />
            }
            content={
              event && (
                <div className="pointer-events-auto max-h-[35vh] overflow-y-scroll lg:h-[45vh]">
                  <RankingDisplay event={event} disable />
                </div>
              )
            }
          />
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 flex w-full items-center justify-evenly rounded-t-2xl bg-slate-950 p-2 shadow-lg shadow-black/15 transition-all duration-300 ease-in-out lg:static lg:w-full lg:rounded-lg">
        <Modal id="GuestPageSellerForm" icon="carbon:edit">
          <SellerForm seller={seller?.guest} />
        </Modal>
        <Modal id="GuestPageSaleForm" icon="carbon:shopping-cart-plus">
          <SaleForm eventId={event?.id} guestId={sellerId} isGuest />
        </Modal>
      </nav>
    </div>
  );
}
