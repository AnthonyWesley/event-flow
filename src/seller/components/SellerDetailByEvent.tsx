import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import SellerForm from "./SellerForm";
import Dialog from "../../components/Dialog";
import { useSellerMutations } from "../hooks/useSellerMutations";
import useProduct from "../../product/hooks/useProduct";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";
import SaleList from "../../sale/components/SaleList";
import Accordion from "../../components/Accordion";
import Modal from "../../components/Modal";
import { CircularProgress } from "../../components/CircularProgress";
import { useModalStore } from "../../store/useModalStore";
import CopyToClipboard from "../../components/CopyToClipboard";
import { useState, useEffect } from "react";
import Avatar from "../../components/Avatar";
import PremiumFeature from "../../components/PremiumFeature";
import Card2 from "../../components/Card2";
import { fieldFormatter } from "../../helpers/fieldFormatter";

interface SellerDetailByEventProps {
  seller: {
    id: string;
    name: string;
    photo: string;
    email: string;
    phone: string;
    totalSalesCount: number;
    totalSalesValue: number;
  };

  event: any;
  sellerGoal: number;
  currentProgress: number;
  isValueGoal: boolean;
  goalLabel: string;
  index: number;
}

const getGoalColor = (currentProgress: number, sellerGoal: number) =>
  goalUtils.handleGoalAchieved(currentProgress, sellerGoal);

export default function SellerDetailByEvent({
  seller,
  event,
  sellerGoal,
  currentProgress,
  isValueGoal,
  goalLabel,
  index,
}: SellerDetailByEventProps) {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const { deleteSeller } = useSellerMutations();
  const {
    queryProducts: { data: products = [] },
  } = useProduct();
  const { closeModal } = useModalStore();

  const goalColor = getGoalColor(currentProgress, sellerGoal);

  const allSalesBySeller = event?.sales?.filter(
    (sale: any) => sale.sellerId === seller.id,
  );

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Card2 className="bg-blue flex w-full flex-col gap-2 pl-1">
      <Accordion
        title={
          <header className="flex w-full items-center justify-between gap-2">
            <Avatar name={seller?.name} image={seller?.photo} />
            <div className="mr-auto w-25">
              <InfoLine
                value={fieldFormatter.name(seller?.name, "firstTwo")}
                // value={seller?.name}
                size="base"
              />
            </div>
            <div className="flex w-20 items-start justify-end border-l border-l-gray-500/15 pl-2 text-4xl">
              <h1> {index}</h1>
              <p className="text-base">º</p>
            </div>
          </header>
        }
        content={
          <section className="p-2">
            <InfoLine
              label="E-mail:"
              value={seller.email}
              size="sm"
              line="col"
            />
            <InfoLine
              label="Telefone:"
              value={seller.phone}
              size="sm"
              line="col"
            />
            <PremiumFeature>
              <div className="mr-auto">
                <CopyToClipboard
                  // text={`https://event-flow-api.vercel.app/events/${event.id}/guest/${seller.id}`}
                  text={`https://event-flow-awl.netlify.app/events/${event.id}/guest/${seller.id}?token=${token}`}
                  label="Copiar Convite"
                />
              </div>
            </PremiumFeature>
          </section>
        }
      />

      {/* <InfoLine label="Vendas:" value={event?.name} /> */}
      <section className="flex items-center justify-between gap-2 p-2">
        <CircularProgress total={sellerGoal} current={currentProgress} />
        <FlexSection className="items-start">
          <InfoLine
            label="Meta:"
            value={goalLabel}
            icon={!isValueGoal ? "iconoir:box-iso" : ""}
            color={goalColor}
          />

          <InfoLine
            label="Vendas:"
            value={seller.totalSalesCount}
            icon="iconoir:box-iso"
            color={!isValueGoal ? goalColor : ""}
          />

          <InfoLine
            label="Total:"
            value={currencyFormatter.ToBRL(seller.totalSalesValue)}
            color={isValueGoal ? goalColor : ""}
          />
        </FlexSection>
        <div className="ml-auto flex flex-col gap-2">
          <Modal
            id="SellerDetailByEventSellerForm"
            info="Editar"
            icon="carbon:edit"
          >
            <SellerForm seller={seller} />
          </Modal>
          <Modal
            id="SellerDetailByEventDeleteForm"
            info="Deletar"
            icon="carbon:trash-can"
          >
            <Dialog
              message="Deseja excluir o vendedor?"
              onClick={() => {
                deleteSeller.mutate(
                  {
                    sellerId: seller.id,
                    eventId: event.id,
                  },
                  { onSuccess: () => closeModal(seller.id) },
                );
              }}
            />
          </Modal>
        </div>
      </section>
      <Accordion
        title={<h1 className="text-gray-400">Vendas</h1>}
        content={
          <>
            <FlexSection className="max-h-[35vh] overflow-y-scroll">
              {allSalesBySeller && allSalesBySeller.length > 0 ? (
                <SaleList
                  sales={allSalesBySeller}
                  sellers={[seller]}
                  products={products}
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhuma venda registrada.
                </p>
              )}
            </FlexSection>
          </>
        }
      />
    </Card2>
  );
}
