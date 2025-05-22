import { useQuery } from "@tanstack/react-query";
import { partnerService } from "../services/partnerService";

export default function usePartner() {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  const queryPartner = useQuery({
    queryKey: ["partnerData"],
    queryFn: partnerService.findPartner,
    enabled: isAuthenticated,
  });

  const queryPartnerNotifications = useQuery({
    queryKey: ["notificationsData"],
    queryFn: partnerService.getNotification,
    enabled: isAuthenticated,
  });

  return { queryPartner, queryPartnerNotifications };
}
