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
import InfoList from "../../components/InfoList";

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
          <FlexSection className="items-start overflow-hidden border-gray-500/15 px-0 py-0 lg:max-h-[65vh] lg:flex-row">
            <div className="bg-dark flex max-h-full w-full flex-[2] overflow-y-auto lg:h-[65vh]">
              {events && <RankingDisplay event={currentEvent} mode="PODIUM" />}
            </div>

            <div className="flex max-h-[55vh] w-full flex-[1] flex-col bg-slate-900 lg:h-[65vh] lg:max-h-[65vh]">
              <div className={``}>
                {list === "SELLERS" && (
                  <InfoList
                    tittle="Rankig"
                    icon="game-icons:podium-winner"
                    length={currentEvent?.allSellers?.length}
                    className="bg-slate-950"
                  />
                )}

                {list === "SALES" && (
                  <InfoList
                    tittle="Vendas"
                    icon="mi:shopping-cart"
                    length={currentEvent?.sales?.length}
                    className="bg-slate-950"
                  />
                )}
              </div>

              <div className="flex-1 overflow-y-scroll bg-slate-900 px-2">
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

            <nav className="fixed bottom-0 left-0 flex w-full items-center justify-between rounded-2xl border-t border-solid border-gray-100/15 bg-slate-950 p-2 shadow-lg shadow-black/15 transition-all duration-[450ms] ease-in-out lg:static lg:h-[65vh] lg:w-20 lg:flex-col">
              <Tooltip
                info={`${list === "SALES" ? "Vendas" : "Vendedores"} `}
                className="cursor-pointer rounded-full border border-gray-100/15 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
              >
                <ChangeButton onChange={changeList} />
              </Tooltip>
              <Modal
                info={isSalesOrSellers[list].info}
                id={isSalesOrSellers[list].id}
                icon={isSalesOrSellers[list].icon}
              >
                {isSalesOrSellers[list].children}
              </Modal>

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
            </nav>
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
