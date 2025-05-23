import { useQuery } from "@tanstack/react-query";
import { EventOutputDto, eventService } from "../services/eventService";

export function useEvent(eventId?: string) {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  const queryEvents = useQuery({
    queryKey: ["eventsData"],
    queryFn: eventService.list,
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const queryEvent = useQuery({
    queryKey: ["eventData", eventId],
    queryFn: () => eventService.findOne(eventId ?? ""),
    enabled: isAuthenticated && !!eventId,
  });

  const currentEvent = queryEvents.data?.find(
    (event: EventOutputDto) => event.isActive,
  );

  return { queryEvents, queryEvent, currentEvent };
}
