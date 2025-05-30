import { useQuery } from "@tanstack/react-query";
import { EventOutputDto, eventService } from "../services/eventService";

export function useEvent(eventId?: string) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const queryEvents = useQuery({
    queryKey: ["eventsData"],
    queryFn: eventService.list,
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const currentEvent = queryEvents.data?.find(
    (event: EventOutputDto) => event.isActive,
  );

  const queryEvent = useQuery({
    queryKey: ["eventData", eventId],
    queryFn: () => eventService.findOne(eventId ?? ""),
    enabled: isAuthenticated && !!eventId,
  });

  const querySellersByEvents = useQuery({
    queryKey: ["sellersByEvents", eventId, currentEvent],
    queryFn: () => eventService.listSellerByEvent(eventId ?? ""),
    enabled:
      isAuthenticated && !!eventId && currentEvent?.allSellers.length > 0,
  });

  return { queryEvents, queryEvent, currentEvent, querySellersByEvents };
}
