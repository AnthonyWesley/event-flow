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

export default function EventsPageDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

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
                  className="cursor-pointer self-end rounded-full border border-gray-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                  onClick={() => navigate(-1)}
                >
                  <Icon icon="icon-park-outline:back" width="20" />
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
                info={event?.endDate ? "Ativar evento" : "Desativar evento"}
                icon={
                  <Icon
                    icon="lets-icons:on-button"
                    width="20"
                    className={
                      event?.endDate ? "text-gray-400" : "text-green-500"
                    }
                  />
                }
              >
                <Dialog
                  message={
                    event?.endDate ? "Reativar evento?" : "Encerrar evento?"
                  }
                  onClick={() => toggleStatus.mutate(event.id)}
                  color="bg-green"
                />
              </Modal>
            </>
          }
        >
          <FlexSection>
            <HeaderRanking event={event} />
            <div className="flex w-full justify-between gap-2 text-gray-50">
              <InfoLine label="Inicio:" value={formatDate(event?.createdAt)} />
              <InfoLine
                label="Fim:"
                value={event?.endDate ? formatDate(event?.endDate) : "Ativo"}
              />
            </div>
            {/* <div className="my-2 w-full">
                                <RankingDisplay event={event} mode="WINNER" />
                              </div> */}
          </FlexSection>
        </Card>
      </div>
    </>
  );
}
