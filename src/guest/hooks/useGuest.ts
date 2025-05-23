import { useQuery } from "@tanstack/react-query";
import { guestService } from "../services/guestService";

export default function useGuest(eventId: string, sellerId: string) {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  const queryGuest = useQuery({
    queryKey: ["guestData", eventId, sellerId],
    queryFn: () => guestService.getGuest(eventId, sellerId),
    enabled: isAuthenticated,
  });

  return { queryGuest };
}
