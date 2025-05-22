import { useNavigate } from "react-router-dom";
import { useEventMutations } from "../../event/hooks/useEventMutations";
import { EventOutputDto } from "../../event/services/eventService";

export default function useRanking(event?: EventOutputDto) {
  const { toggleStatus, deleteEvent } = useEventMutations();
  const navigate = useNavigate();

  const toggleEvent = () => {
    if (!event?.id) return;
    toggleStatus.mutate(event.id, {
      onSuccess: () => {
        event?.endDate ? navigate("/") : navigate("/events");
      },
    });
  };

  const handleDelete = () => {
    if (!event?.id) return;
    deleteEvent.mutate(event.id);
  };

  return {
    toggleEvent,
    handleDelete,
  };
}
