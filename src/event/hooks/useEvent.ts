import { useQuery } from "@tanstack/react-query";
import { EventOutputDto, eventService } from "../services/eventService";

export function useEvent(eventId?: string, search?: string) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const queryEvents = useQuery({
    queryKey: ["eventsData", search],
    queryFn: () => eventService.list(search),
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
    refetchInterval: 5000,
  });

  const querySellersByEvents = useQuery({
    queryKey: ["sellersByEvents", eventId, queryEvent.data],
    queryFn: () => eventService.listSellerByEvent(eventId ?? ""),
    enabled:
      isAuthenticated && !!eventId && queryEvent.data?.allSellers.length > 0,
  });

  console.log(queryEvent?.data);

  return { queryEvents, queryEvent, currentEvent, querySellersByEvents };
}
