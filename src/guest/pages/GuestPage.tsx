import FlexSection from "../../components/FlexSection";
import Spin from "../../components/Spin";
import SaleList from "../../sale/components/SaleList";
import useProduct from "../../product/hooks/useProduct";
import SellerForm from "../../seller/components/SellerForm";
import SaleForm from "../../sale/components/SaleForm";
import Modal from "../../components/Modal";
import RankingDisplay from "../../ranking/components/RankingDisplay";
import { InfoLine } from "../../components/InfoLine";
import { useEvent } from "../../event/hooks/useEvent";
import { goalUtils } from "../../helpers/goalUtils";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { CircularProgress } from "../../components/CircularProgress";
import { useParams } from "react-router-dom";
import useGuest from "../hooks/useGuest";
import { useEffect, useState } from "react";
import Accordion from "../../components/Accordion";
import InfoList from "../../components/InfoList";
import NavAction from "../../components/NavAction";
import AvatarUploader from "../../components/AvatarUploader";
import partnerApi from "../../api/axios";
import { SaleOutputDto } from "../../sale/services/saleService";
import Card from "../../components/Card";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import AnimatedSection from "../../components/AnimatedSection";

export default function GuestPage() {
  const [isReady, setIsReady] = useState(false);

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

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    setIsReady(true);
  }, []);

  if (!isReady || isEventLoading || isProductLoading || isSellerLoading) {
    return <Spin />;
  }

  const currentIndex = Array.isArray(event?.allSellers)
    ? event?.allSellers.findIndex((s: any) => s.name === seller?.guest?.name) +
      1
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
  const totalQuantity =
    seller?.guest?.sales?.reduce(
      (acc: any, sale: SaleOutputDto) => acc + (sale?.quantity ?? 0),
      0,
    ) ?? 0;

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

  if (!event?.isActive) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Evento finalizado</h1>
          <p className="text-lg">Aguarde até o evento ser ativo.</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatedSection>
      <section className="mb-1 flex w-full flex-col gap-1 lg:flex-row">
        <Card className="bg-blue w-full pl-[1px]">
          <header className="flex h-30 w-full items-center gap-2 truncate rounded-lg p-1">
            <AvatarUploader
              icon="iconoir:box-iso"
              size="w-25 h-25"
              image={seller?.guest?.photo}
              onUpload={(file) => {
                const formData = new FormData();
                formData.append("photo", file);
                return partnerApi.patch(
                  `/seller/${seller?.guest?.id}/photo`,
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  },
                );
              }}
              onSuccess={(res) => console.log("Upload concluído:", res)}
            />
            <div className="mr-auto">
              <InfoLine value={seller?.guest?.name} line="col" />

              <InfoLine
                label="E-mail:"
                value={seller?.guest?.email}
                size="sm"
                line="col"
              />

              <InfoLine
                label="Telefone:"
                value={fieldFormatter.phone(seller?.guest?.phone)}
                size="sm"
                line="col"
              />
            </div>
          </header>
        </Card>
        <NavAction position="vertical" className="justify-evenly gap-2">
          <Modal id="GuestPageSellerForm" icon="carbon:edit">
            <SellerForm seller={seller?.guest} />
          </Modal>
          <Modal id="GuestPageSaleForm" icon="carbon:shopping-cart-plus">
            <SaleForm eventId={event?.id} guestId={sellerId} isGuest />
          </Modal>
        </NavAction>
      </section>
      <section className="flex w-full items-center justify-between p-2">
        <InfoLine label="Evento:" value={event?.name} size="lg" line="col" />

        <div className="flex w-20 items-start justify-end border-gray-500/25 text-5xl lg:text-5xl">
          <h1 className={`${goalUtils.podiumColor(currentIndex)}`}>
            {currentIndex}
          </h1>

          <p className={`text-base ${goalUtils.podiumColor(currentIndex)}`}>
            º
          </p>
        </div>
      </section>
      <section className="flex w-full items-center justify-between gap-2 p-2">
        <FlexSection className="w-full items-start justify-start gap-2">
          <InfoLine
            label="Meta:"
            value={goalLabel}
            icon={!isValueGoal ? "iconoir:box-iso" : ""}
            color={goalColor}
            size="lg"
          />

          <div
            className={`flex flex-col items-start gap-2 ${event.goalType == "VALUE" ? "" : "flex-col-reverse"}`}
          >
            <InfoLine
              label="Total:"
              value={currencyFormatter.ToBRL(seller?.guest?.totalSalesValue)}
              color={goalColor}
              size="lg"
            />
            <InfoLine
              label="Vendas:"
              value={seller?.guest?.totalSalesCount}
              icon="iconoir:box-iso"
              color={!isValueGoal ? goalColor : ""}
              size="lg"
            />
          </div>
        </FlexSection>
        <CircularProgress total={goal} current={currentProgress} />
      </section>

      <section className="flex w-full flex-col rounded-lg lg:flex-row">
        <div className="mb-2 w-full rounded-lg bg-slate-950 lg:mr-2">
          <Accordion
            title={
              <InfoList
                tittle="Vendas"
                icon="mi:shopping-cart"
                length={totalQuantity}
                className="mx-4 w-full rounded-t-2xl border-b border-gray-500/15 py-4"
              />
            }
            content={
              event?.sales.length > 0 && (
                <div className="max-h-[35vh] overflow-y-scroll border-r border-gray-500/15">
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

        <div className="mb-2 w-full rounded-lg bg-slate-950">
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
                <div className="pointer-events-auto max-h-[35vh] overflow-y-scroll">
                  <RankingDisplay event={event} disable />
                </div>
              )
            }
          />
        </div>
      </section>
    </AnimatedSection>
  );
}
