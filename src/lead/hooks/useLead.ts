import { useQuery } from "@tanstack/react-query";
import { leadService } from "../services/leadService";

export default function useLead(eventId?: string, leadId?: string) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const queryLeads = useQuery({
    queryKey: ["leadsData"],
    queryFn: leadService.listAll,
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const queryLeadByEvent = useQuery({
    queryKey: ["leadsByEventData", eventId],
    queryFn: () => leadService.listByEvent(eventId ?? ""),
    enabled: isAuthenticated && !!eventId,
  });

  const queryLead = useQuery({
    queryKey: ["leadData", leadId],
    queryFn: () => leadService.findOne(eventId ?? "", leadId ?? ""),
    enabled: isAuthenticated && !!leadId && !!eventId,
  });

  return { queryLeads, queryLead, queryLeadByEvent };
}
