import { Icon } from "@iconify/react/dist/iconify.js";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import Spin from "../../components/Spin";
import { useEvent } from "../hooks/useEvent";
import { EventOutputDto } from "../services/eventService";
import HeaderRanking from "../../ranking/components/HeaderRanking";
import { formatDate } from "../../helpers/formatDate";
import { useLocation, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import Modal from "../../components/Modal";
import Card from "../../components/Card";
import Accordion from "../../components/Accordion";

type StatusEvent = {
  CREATED: EventOutputDto[];
  ACTIVE: EventOutputDto[];
  FINISH: EventOutputDto[];
};
export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    queryEvents: { data: events, isPending, error },
  } = useEvent();

  if (isPending) return <Spin />;
  if (error) return "Erro ao carregar evento.";

  const statusEvents: StatusEvent = {
    ACTIVE: events.filter((event: EventOutputDto) => event.isActive),
    CREATED: events.filter(
      (event: EventOutputDto) => !event.isActive && !event.endDate,
    ),
    FINISH: events.filter(
      (event: EventOutputDto) => !event.isActive && event.endDate,
    ),
  };

  const sections = [
    { title: "Em Andamento", key: "ACTIVE", color: "orange" },
    { title: "Não Iniciados", key: "CREATED", color: "gray" },
    { title: "Finalizados", key: "FINISH", color: "slate" },
  ];

  return (
    <>
      <header className="flex items-center justify-between text-xl font-bold">
        <span className="ml-4 flex w-full items-center justify-between p-1">
          <h1>EVENTOS</h1>
          <Modal
            id="EventsPageEventForm"
            className="bg-slate-900"
            icon={<Icon icon="ic:baseline-plus" width="25" />}
          >
            <EventForm />
          </Modal>
        </span>
      </header>

      {sections?.map(({ title, key, color }) => {
        const list = statusEvents[key as keyof typeof statusEvents];

        return (
          <Accordion
            key={key}
            startOpen={key === "ACTIVE" ? true : false}
            title={
              <h2 className="px-2 text-lg font-semibold text-slate-300">
                {title} ({list?.length})
              </h2>
            }
            content={
              <section key={key} className="px-2 pb-2">
                {list?.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Nenhum evento encontrado.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {list?.map((event: EventOutputDto) => (
                      <div
                        key={event.id}
                        className={`w-full cursor-pointer transition-opacity duration-200 hover:opacity-90 ${
                          event.isActive ? "opacity-100" : "opacity-80"
                        }`}
                        onClick={() =>
                          navigate(`/events/${event.id}`, {
                            state: { backgroundLocation: location },
                          })
                        }
                      >
                        <Card icon="carbon:event" color={color}>
                          <HeaderRanking event={event} />
                          <FlexSection className="flex-row px-0">
                            <InfoLine
                              line="col"
                              label="Início:"
                              value={formatDate(event.createdAt)}
                            />
                            <InfoLine
                              line="col"
                              label={
                                event.endDate
                                  ? "Finalizado:"
                                  : event.isActive
                                    ? "Status:"
                                    : "Status:"
                              }
                              value={
                                event.endDate
                                  ? formatDate(event.endDate)
                                  : event.isActive
                                    ? "Ativo"
                                    : "Não iniciado"
                              }
                              color={
                                event.isActive
                                  ? "green"
                                  : event.endDate
                                    ? "gray"
                                    : "yellow"
                              }
                            />
                          </FlexSection>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            }
          />
        );
      })}
    </>
  );
}
