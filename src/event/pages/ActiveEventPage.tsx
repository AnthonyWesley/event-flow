import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import Dialog from "../../components/Dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import EventForm from "../components/EventForm";
import FlexSection from "../../components/FlexSection";
import HeaderRanking from "../../ranking/components/HeaderRanking";
import Modal from "../../components/Modal";
import Tooltip from "../../components/Tooltip";
import { useEffect, useState } from "react";
import ChangeButton from "../../components/ChangeButton";
import EventIcon from "../../icons/eventIcon";
import useProduct from "../../product/hooks/useProduct";
import RankingDisplay from "../../ranking/components/RankingDisplay";
import useRanking from "../../ranking/hooks/useRanking";
import { SalesOrSellersItem } from "../../ranking/types/SalesOrSellersItem";
import { SalesOrSellersKey } from "../../ranking/types/SalesOrSellersKey";
import SaleForm from "../../sale/components/SaleForm";
import SaleList from "../../sale/components/SaleList";
import SellerForm from "../../seller/components/SellerForm";

export default function ActiveEventPage() {
  const navigate = useNavigate();

  const { eventId } = useParams<{ eventId: string }>();
  const {
    queryEvent: { data: event, isPending, error },
  } = useEvent(eventId);

  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  useEffect(() => {
    if (eventId) {
      localStorage.setItem("lastEventId", eventId);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) {
      const last = localStorage.getItem("lastEventId");
      if (last) {
        navigate(`/events/${last}`); // redireciona para o evento salvo
      }
    }
  }, [eventId, navigate]);

  const { toggleEvent, handleDelete } = useRanking(event);
  const [list, setList] = useState<SalesOrSellersKey>("SELLERS");

  if (isPending) return <Spin />;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  const changeList = (status: any) => {
    setList(status);
  };

  const modalActions = [
    {
      id: "RankingPageEventToggleForm",
      info: !event?.endDate ? "Finalizar Evento" : "Ativar Evento",
      icon: (
        <Icon
          icon="lets-icons:on-button"
          width="20"
          className={
            event?.endDate ? "text-gray-400" : "animate-pulse text-green-500"
          }
        />
      ),
      children: (
        <Dialog
          message={event?.endDate ? "Reativar evento?" : "Encerrar evento?"}
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
      children: <EventForm event={event} />,
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
      children: <SaleForm eventId={event?.id} />,
    },
    SELLERS: {
      title: "Vendedores",
      id: "RankingPageSellerForm",
      info: "Add vendedor",
      icon: "material-symbols:person-add",
      children: <SellerForm eventId={event?.id} />,
    },
  };

  return (
    <>
      {event ? (
        <>
          <HeaderRanking event={event} />
          {/* <SendText /> */}
          <FlexSection className="items-start border border-gray-500/15 px-0 py-0 lg:max-h-[65vh] lg:flex-row">
            <div className="bg-dark flex max-h-full w-full flex-[2] overflow-y-auto lg:min-h-[65vh]">
              {/* <div className="absolute lg:hidden">
                <CircularMenu />
              </div> */}
              {event && <RankingDisplay event={event} mode="PODIUM" />}
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
              <h1 className="bg-slate-900 p-2 text-center">
                {list === "SALES"
                  ? `Vendas (${event?.sales?.length || 0})`
                  : `Vendedores (${event?.allSellers?.length || 0})`}
              </h1>
              <div
                className={`h-[35vh] overflow-y-scroll border-t-4 bg-slate-900 lg:h-[65vh] ${list === "SALES" ? "border-rose-500" : "border-cyan-800"}`}
              >
                {list === "SALES" &&
                  event.allSellers &&
                  event.allSellers.length > 0 && (
                    <SaleList
                      sales={event.sales}
                      sellers={event.allSellers}
                      products={products}
                    />
                  )}

                {list === "SELLERS" && (
                  <RankingDisplay
                    event={event}
                    mode={event.sales <= 0 ? "NORMAL" : "OTHERS"}
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
            <EventForm event={event} />
          </Modal>
        </div>
      )}
    </>
  );
}
