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

interface SellerDetailByEventProps {
  seller: {
    id: string;
    name: string;
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
    <div className="w-full bg-slate-900 p-2">
      <FlexSection className="flex-row">
        <Avatar name={seller?.name} />

        <FlexSection className="items-start">
          <Accordion
            title={<InfoLine value={seller?.name} size="base" />}
            content={
              <>
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
              </>
            }
          />
          <div className="mr-auto">
            <CopyToClipboard
              // text={`https://event-flow-api.vercel.app/events/${event.id}/guest/${seller.id}`}
              text={`${import.meta.env.NETLIFY_API_URL || "http://localhost:5173"}/events/${event.id}/guest/${seller.id}?token=${token}`}
              label="Copiar Convite"
            />
          </div>
        </FlexSection>
        <div className="ml-auto flex w-20 items-start justify-center border-l border-l-gray-500/15 pl-2 text-4xl">
          <h1> {index}</h1>
          <p className="text-base">º</p>
        </div>
      </FlexSection>

      <FlexSection>
        <FlexSection className="w-full flex-row justify-start border-t border-b border-gray-400/15">
          {/* <InfoLine label="Vendas:" value={event?.name} /> */}
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
        </FlexSection>
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
      </FlexSection>
    </div>
  );
}
