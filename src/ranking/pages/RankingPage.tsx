import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import EventForm from "../../event/components/EventForm";
import SaleForm from "../../sale/components/SaleForm";
import Dialog from "../../components/Dialog";
import RankingDisplay from "../components/RankingDisplay";
import Modal from "../../components/Modal";
import { useEvent } from "../../event/hooks/useEvent";
import useRanking from "../hooks/useRanking";
import SellerForm from "../../seller/components/SellerForm";
import FlexSection from "../../components/FlexSection";
import ChangeButton from "../../components/ChangeButton";
import SaleList from "../../sale/components/SaleList";
import useProduct from "../../product/hooks/useProduct";
import { useState } from "react";
import { SalesOrSellersItem } from "../types/SalesOrSellersItem";
import { SalesOrSellersKey } from "../types/SalesOrSellersKey";
import Tooltip from "../../components/Tooltip";
import EventIcon from "../../icons/eventIcon";
import HeaderRanking from "../components/HeaderRanking";

export const eventsLinks = [
  {
    href: "/sellers",
    text: "Vendedores",
    icon: "tdesign:user-list-filled",
  },
  {
    href: "/sales",
    text: "Vendas",
    icon: "hugeicons:sale-tag-01",
  },
];

export default function RankingPage() {
  const {
    queryEvents: { data: events, isPending, error },
    currentEvent,
  } = useEvent();

  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  const { toggleEvent, handleDelete } = useRanking(currentEvent);
  const [list, setList] = useState<SalesOrSellersKey>("SELLERS");

  if (isPending) return <Spin />;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  const changeList = (status: any) => {
    setList(status);
  };

  const modalActions = [
    {
      id: "RankingPageEventToggleForm",
      info: !currentEvent?.endDate ? "Finalizar Evento" : "Ativar Evento",
      icon: (
        <Icon
          icon="lets-icons:on-button"
          width="20"
          className={
            currentEvent?.endDate
              ? "text-gray-400"
              : "animate-pulse text-green-500"
          }
        />
      ),
      children: (
        <Dialog
          message={
            currentEvent?.endDate ? "Reativar evento?" : "Encerrar evento?"
          }
          onClick={toggleEvent}
          color="bg-green"
        />
      ),
    },
    {
      id: "RankingPageEventForm",
      info: "Editar evento",
      // icon: "mdi:event-edit",
      icon: <EventIcon icon="PEN" />,
      children: <EventForm event={currentEvent} />,
    },

    {
      id: "RankingPageEventDeleteForm",
      info: "Deletar Evento",
      icon: "carbon:trash-can",

      children: (
        <Dialog
          message="Deseja excluir o evento?"
          onClick={handleDelete}
          color="bg-rose"
        />
      ),
    },
  ];

  const isSalesOrSellers: Record<SalesOrSellersKey, SalesOrSellersItem> = {
    SALES: {
      title: "Vendas",
      id: "RankingPageSaleForm",
      info: "Add venda",
      icon: "mi:shopping-cart-add",
      children: <SaleForm eventId={currentEvent?.id} />,
    },
    SELLERS: {
      title: "Vendedores",
      id: "RankingPageSellerForm",
      info: "Add vendedor",
      icon: "material-symbols:person-add",
      children: <SellerForm eventId={currentEvent?.id} />,
    },
  };

  return (
    <>
      {currentEvent ? (
        <>
          <HeaderRanking event={currentEvent} />
          {/* <SendText /> */}
          <FlexSection className="items-start border border-gray-500/15 px-0 py-0 lg:max-h-[65vh] lg:flex-row">
            <div className="bg-dark flex max-h-full w-full flex-[2] overflow-y-auto lg:min-h-[65vh]">
              {events && <RankingDisplay event={currentEvent} mode="PODIUM" />}
            </div>
            <div className="flex h-[65vh] w-full flex-[1] flex-col">
              <div className="flex items-center justify-between border-b border-gray-500/15 bg-slate-900 p-2">
                {modalActions.map((modal) => (
                  <Modal
                    info={modal.info}
                    key={modal.id}
                    id={modal.id ?? ""}
                    icon={modal.icon}
                  >
                    {modal.children}
                  </Modal>
                ))}
                <span className="h-14 border border-gray-500/15"></span>
                <Modal
                  info={isSalesOrSellers[list].info}
                  id={isSalesOrSellers[list].id}
                  icon={isSalesOrSellers[list].icon}
                >
                  {isSalesOrSellers[list].children}
                </Modal>
                <Tooltip
                  info={`${list === "SALES" ? "Vendas" : "Vendedores"} `}
                  className="cursor-pointer rounded-full border border-gray-100/15 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                >
                  <ChangeButton onChange={changeList} />
                </Tooltip>
                {/* <p className="flex w-full justify-between bg-slate-800 text-lg"> */}
                {/* <Icon icon={`mdi:users`} width="30" /> */}
                {/* <Icon icon="carbon:list" width="30" /> */}
                {/* {isSalesOrSellers[list].title} */}
                {/* </p> */}
              </div>
              <div
                className={`overflow-y-scroll border-t-4 bg-slate-900 lg:h-[65vh] ${list === "SALES" ? "border-rose-500" : "border-cyan-800"}`}
              >
                {list === "SALES" &&
                  currentEvent.allSellers &&
                  currentEvent.allSellers.length > 0 && (
                    <SaleList
                      sales={currentEvent.sales}
                      sellers={currentEvent.allSellers}
                      products={products}
                    />
                  )}

                {list === "SELLERS" && (
                  <RankingDisplay
                    event={currentEvent}
                    mode={currentEvent.sales <= 0 ? "NORMAL" : "OTHERS"}
                  />
                )}
              </div>
            </div>
          </FlexSection>
        </>
      ) : (
        <div className="shadow-basic mb-2 flex w-full flex-col items-center justify-end gap-1 rounded-md border border-gray-100/15 p-2 italic">
          Nenhum evento ativo no momento!
          <div>Criar evento</div>
          <Modal
            info="Criar"
            id="RankingPageEventForm2"
            icon={<Icon icon="ic:baseline-plus" width="40" />}
          >
            <EventForm event={currentEvent} />
          </Modal>
        </div>
      )}
    </>
  );
}
