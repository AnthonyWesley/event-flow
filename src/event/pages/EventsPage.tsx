import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import MultiSectionEntityListPage from "../../components/MultiSectionEntityListPage";
import { formatDate } from "../../helpers/formatDate";
import HeaderRanking from "../../ranking/components/HeaderRanking";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { EventOutputDto } from "../services/eventService";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const navigate = useNavigate();

  return (
    <MultiSectionEntityListPage<EventOutputDto>
      title="EVENTOS"
      searchPlaceholder="Buscar... Eventos"
      useQuery={(search) => {
        const { data, isLoading, error } = useEvent(
          undefined,
          search,
        ).queryEvents;
        return {
          data,
          isLoading,
          error: error ?? undefined,
        };
      }}
      FormModal={<EventForm />}
      onItemClick={(event) => navigate(`/events/${event.id}`)}
      CardComponent={(event) => (
        <Card
          className={`rounded pt-[1px] ${!event.isActive ? "bg-silver opacity-50" : "bg-gold"}`}
          childrenStyle={`hover:shadow-[0_0_10px_#ffdd01]`}
        >
          <HeaderRanking event={event} />
          <FlexSection className="justify-between border-t border-gray-500/15 pt-2">
            <InfoLine label="Início:" value={formatDate(event.createdAt)} />
            <InfoLine
              label="Status:"
              value={
                event.endDate
                  ? "Finalizado"
                  : event.isActive
                    ? "Ativo"
                    : "Não iniciado"
              }
              color={
                event.endDate ? "gray" : event.isActive ? "green" : "yellow"
              }
            />
          </FlexSection>
        </Card>
      )}
      sections={[
        {
          title: "Em Andamento",
          key: "ACTIVE",
          filter: (e) => e.isActive,
        },
        {
          title: "Finalizados",
          key: "FINISH",
          filter: (e) => !e.isActive && !!e.endDate,
        },
        {
          title: "Não Iniciados",
          key: "CREATED",
          filter: (e) => !e.isActive && !e.endDate,
        },
      ]}
    />
  );
}
