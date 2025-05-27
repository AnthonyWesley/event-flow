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

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    queryEvents: { data: events, isPending, error },
  } = useEvent();
  if (isPending) return <Spin />;
  if (error) return "Erro ao carregar evento.";

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
      <div className="grid w-full place-items-center gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {events?.map((event: EventOutputDto) => (
          <div
            key={event.id}
            className={`w-full ${event.isActive ? "opacity-100" : "opacity-70"}`}
            onClick={() =>
              navigate(`/events/${event.id}`, {
                state: { backgroundLocation: location },
              })
            }
          >
            <Card
              key={event.id}
              // icon={"iconoir:box-iso"}
              icon="carbon:event"
              color={event.isActive ? "orange" : "gray"}
            >
              <HeaderRanking event={event} />
              <FlexSection className="flex-row px-0">
                <InfoLine
                  line="col"
                  label="Inicio:"
                  value={formatDate(event.createdAt)}
                />
                <InfoLine
                  line="col"
                  label={event.endDate ? "Finalizado:" : "Status"}
                  value={event.endDate ? formatDate(event.endDate) : "Ativo"}
                  color={event.isActive ? "green" : ""}
                />
              </FlexSection>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
