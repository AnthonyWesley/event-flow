import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import { InfoLine } from "../../components/InfoLine";
import Dialog from "../../components/Dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import EventForm from "../components/EventForm";
import { useEventMutations } from "../hooks/useEventMutations";
import { formatDate } from "../../helpers/formatDate";
import Modal from "../../components/Modal";
import Tooltip from "../../components/Tooltip";
import useProduct from "../../product/hooks/useProduct";
import RankingDisplay from "../../ranking/components/RankingDisplay";
import SaleList from "../../sale/components/SaleList";
import InfoList from "../../components/InfoList";
import { CircularProgress } from "../../components/CircularProgress";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";
import Accordion from "../../components/Accordion";
import NavAction from "../../components/NavAction";
import PremiumFeature from "../../components/PremiumFeature";
import EventReportPdfButton from "../components/EventReportPdfButton";
import AvatarUploader from "../../components/AvatarUploader";
import partnerApi from "../../api/axios";
import { SaleOutputDto } from "../../sale/services/saleService";
import Card from "../../components/Card";

export default function EventsDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const navigate = useNavigate();
  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  const {
    queryEvent: { isPending, error, data: event },
  } = useEvent(eventId);

  const { deleteEvent, toggleStatus } = useEventMutations();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const totalQuantity =
    event?.sales?.reduce(
      (acc: any, sale: SaleOutputDto) => acc + (sale?.quantity ?? 0),
      0,
    ) ?? 0;

  return (
    <>
      <section className="mb-1 flex w-full flex-col lg:flex-row">
        <Card className="bg-gold my-2 w-full pl-1">
          <header className="flex w-full flex-col items-center gap-2 rounded-lg lg:flex-row">
            <section className="flex w-full items-center gap-2">
              <AvatarUploader
                icon="iconoir:box-iso"
                size="w-25 h-25"
                image={event?.photo}
                onUpload={(file) => {
                  const formData = new FormData();
                  formData.append("photo", file);
                  return partnerApi.patch(
                    `/event/${event?.id}/photo`,
                    formData,
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    },
                  );
                }}
                onSuccess={(res) => console.log("Upload concluído:", res)}
              />
              <div className="flex flex-col items-start">
                <InfoLine label="Evento:" value={event?.name} size="lg" />
                <InfoLine
                  label="Inicio:"
                  value={formatDate(event?.createdAt)}
                  size="lg"
                />
                <InfoLine
                  label="Fim:"
                  value={
                    event.endDate
                      ? formatDate(event.endDate)
                      : event.isActive
                        ? "Ativo"
                        : "Não iniciado"
                  }
                  size="lg"
                />
              </div>
            </section>
          </header>
        </Card>
        <NavAction className="justify-evenly" position="vertical">
          <Tooltip info="Leads">
            <div
              className="cursor-pointer self-end rounded-full border border-slate-100/15 p-3 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
              onClick={() => navigate(`/events/${eventId}/leads`)}
            >
              <Icon icon="fluent:target-arrow-16-regular" width="25" />
            </div>
          </Tooltip>
          <Tooltip info="Baixar relatório">
            <PremiumFeature>
              <EventReportPdfButton event={event} products={products} />
            </PremiumFeature>
          </Tooltip>
        </NavAction>
      </section>
      <section className={`flex w-full justify-between gap-2 p-2`}>
        <div className="flex flex-col items-start gap-2">
          <InfoLine
            label={`Meta:`}
            value={
              event.goalType == "VALUE"
                ? currencyFormatter.ToBRL(event.goal)
                : event.goal + " unid."
            }
            color={goalUtils.handleGoalAchieved(
              goalUtils.getTotalForGoal(event.allSellers, event.goalType),
              event?.goal,
            )}
            size="lg"
          />
          <div
            className={`flex flex-col items-start gap-2 ${event.goalType == "VALUE" ? "" : "flex-col-reverse"}`}
          >
            <InfoLine
              label="Total:"
              value={currencyFormatter.ToBRL(
                goalUtils.getTotalForGoal(event.allSellers, "VALUE"),
              )}
              color={goalUtils.handleGoalAchieved(
                goalUtils.getTotalForGoal(event.allSellers, event.goalType),
                event?.goal,
              )}
              size="lg"
            />
            <InfoLine
              label="Total:"
              value={totalQuantity + " unid."}
              color={goalUtils.handleGoalAchieved(
                goalUtils.getTotalForGoal(event.allSellers, event.goalType),
                event?.goal,
              )}
              size="lg"
            />
          </div>
        </div>
        <CircularProgress
          total={event?.goal}
          current={goalUtils.getTotalForGoal(event.allSellers, event.goalType)}
        />
      </section>
      <section className="flex w-full flex-col lg:flex-row">
        <div className="w-full rounded-lg bg-slate-950">
          <Accordion
            title={
              <InfoList
                tittle="Vendas"
                icon="mi:shopping-cart"
                length={totalQuantity}
                className="w-full rounded-t-2xl p-2"
              />
            }
            content={
              <div className="max-h-[40vh] overflow-y-scroll border-r border-gray-500/15 lg:h-[45vh]">
                {event?.sales.length > 0 && (
                  <SaleList
                    sales={event?.sales}
                    sellers={event?.allSellers}
                    products={products}
                  />
                )}
              </div>
            }
          />
        </div>
        <div className="w-full rounded-lg bg-slate-950">
          <Accordion
            title={
              <InfoList
                tittle="Rankig"
                icon="game-icons:podium-winner"
                length={event?.allSellers?.length}
                className="w-full rounded-t-2xl p-2"
              />
            }
            content={
              event && (
                <div className="pointer-events-auto max-h-[40vh] overflow-y-scroll lg:h-[45vh]">
                  <RankingDisplay event={event} disable />
                </div>
              )
            }
          />
        </div>

        <NavAction className="justify-evenly border" position="vertical">
          <Tooltip info="Voltar">
            <div
              className="cursor-pointer self-end rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
              onClick={() => navigate(-1)}
            >
              <Icon icon="hugeicons:link-backward" width="20" />
            </div>
          </Tooltip>

          <Modal
            id="EventsDetailPageEventForm"
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
            className="ActiveEvent"
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
                !event?.isActive ? "Ativar evento?" : "Desativar evento?"
              }
              onClick={() => toggleStatus.mutate(event.id)}
              color="bg-green"
            />
          </Modal>
        </NavAction>
      </section>
    </>
  );
}
