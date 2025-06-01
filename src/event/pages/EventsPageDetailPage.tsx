import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import Dialog from "../../components/Dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import EventForm from "../components/EventForm";
import { useEventMutations } from "../hooks/useEventMutations";
import FlexSection from "../../components/FlexSection";
import HeaderRanking from "../../ranking/components/HeaderRanking";
import { formatDate } from "../../helpers/formatDate";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import Tooltip from "../../components/Tooltip";
import useProduct from "../../product/hooks/useProduct";
import RankingDisplay from "../../ranking/components/RankingDisplay";
import SaleList from "../../sale/components/SaleList";
import InfoList from "../../components/InfoList";

export default function EventsPageDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  const {
    queryEvent: { isPending, error, data: event },
  } = useEvent(eventId);

  // const {
  //   queryProduct: { data: product },
  // } = useProduct();

  const { deleteEvent, toggleStatus } = useEventMutations();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="w-full">
        <Card
          key={event.id}
          // icon={"iconoir:box-iso"}
          icon="carbon:event"
          color={"orange"}
          isSelected
          footer={
            <>
              <Tooltip info="Voltar">
                <div
                  className="cursor-pointer self-end rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                  onClick={() => navigate(-1)}
                >
                  <Icon icon="hugeicons:link-backward" width="20" />
                </div>
              </Tooltip>

              <Modal
                id="EventsPageDetailPageEventForm"
                icon="carbon:edit"
                info="Editar"
              >
                <EventForm event={event} />
              </Modal>
              <Modal
                id="EventsPageEventDeleteForm"
                icon="carbon:trash-can"
                info="Deletar"
              >
                <Dialog
                  message="Deseja excluir o evento?"
                  onClick={() => {
                    deleteEvent.mutate(event.id);
                    navigate(-1);
                  }}
                />
              </Modal>
              <Modal
                id="EventsPageEventToggleForm"
                info={!event?.isActive ? "Ativar evento" : "Desativar evento"}
                icon={
                  <Icon
                    icon="lets-icons:on-button"
                    width="20"
                    className={
                      !event?.isActive ? "text-slate-400" : "text-green-500"
                    }
                  />
                }
              >
                <Dialog
                  message={
                    event?.isActive ? "Reativar evento?" : "Encerrar evento?"
                  }
                  onClick={() => toggleStatus.mutate(event.id)}
                  color="bg-green"
                />
              </Modal>
            </>
          }
        >
          <FlexSection className="px-0">
            <HeaderRanking event={event} />
            <div className="my-5 flex w-full justify-between gap-2 text-slate-50">
              <InfoLine label="Inicio:" value={formatDate(event?.createdAt)} />
              <InfoLine
                label="Fim:"
                value={
                  event.endDate
                    ? formatDate(event.endDate)
                    : event.isActive
                      ? "Ativo"
                      : "Não iniciado"
                }
              />
            </div>
            {/* <div className="my-2 w-full">
                                <RankingDisplay event={event} mode="WINNER" />
                              </div> */}
          </FlexSection>
          <div className={`w-full gap-2 bg-slate-900 lg:flex`}>
            <div className="pointer-events-none w-full rounded-sm border-t-4 border-b-4 border-slate-800 bg-slate-900/50">
              <InfoList
                tittle="Rankig"
                icon="game-icons:podium-winner"
                length={event?.allSellers?.length}
              />
              {event && (
                <div className="pointer-events-auto max-h-[35vh] overflow-y-scroll lg:h-[45vh]">
                  <RankingDisplay event={event} disable />
                </div>
              )}
            </div>
            <div className="w-full rounded-sm border-t-4 border-b-4 border-slate-800 bg-slate-900/50">
              <InfoList
                tittle="Vendas"
                icon="mi:shopping-cart"
                length={event?.sales?.length}
              />
              <div className="max-h-[35vh] overflow-y-scroll lg:h-[45vh]">
                <SaleList
                  sales={event?.sales}
                  sellers={event?.allSellers}
                  products={products}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
