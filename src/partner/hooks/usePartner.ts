import { useQuery } from "@tanstack/react-query";
import { partnerService } from "../services/partnerService";

export default function usePartner() {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const queryPartner = useQuery({
    queryKey: ["partnerData"],
    queryFn: partnerService.findPartner,
    enabled: isAuthenticated,
  });

  const queryPartners = useQuery({
    queryKey: ["partnersData"],
    queryFn: partnerService.list,
    enabled: isAuthenticated,
  });

  const queryPartnerNotifications = useQuery({
    queryKey: ["notificationsData"],
    queryFn: partnerService.getNotification,
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  return { queryPartner, queryPartners, queryPartnerNotifications };
}
