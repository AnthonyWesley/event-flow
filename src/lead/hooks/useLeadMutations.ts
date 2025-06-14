import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useModalStore } from "../../store/useModalStore";
import { LeadInputDto, leadService } from "../services/leadService";

export function useLeadMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const exportLead = useMutation({
    mutationFn: leadService.export,
    onSuccess: ({ blob, fileName }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Leads exportados com sucesso!");
      closeModal("LeadPageDeleteForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leadsData"] });
      queryClient.invalidateQueries({ queryKey: ["leadData"] });
      queryClient.invalidateQueries({ queryKey: ["leadsByEventData"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao exportar leads");
    },
  });

  const deleteLead = useMutation({
    mutationFn: ({ eventId, leadId }: { eventId: string; leadId: string }) =>
      leadService.delete(eventId, leadId),
    onSuccess: () => {
      toast.success("Lead excluido com sucesso!");
      closeModal("LeadPageDeleteForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leadsData"] });
      queryClient.invalidateQueries({ queryKey: ["leadData"] });
      queryClient.invalidateQueries({ queryKey: ["leadsByEventData"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao excluir vendedor"),
  });

  const createOrUpdate = useMutation({
    mutationFn: ({
      eventId,
      leadId,
      data,
    }: {
      eventId: string;
      leadId?: string;
      data: LeadInputDto;
    }) =>
      leadId
        ? leadService.update(eventId, leadId ?? "", data)
        : leadService.create(eventId ?? "", data),
    onSuccess: (_data, variables) => {
      toast.success("Lead salvo com sucesso!");
      closeModal("LeadPageSellerForm");
      closeModal(`${variables.leadId}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leadsData"] });
      queryClient.invalidateQueries({ queryKey: ["leadData"] });
      queryClient.invalidateQueries({ queryKey: ["leadsByEventData"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao salvar vendedor"),
  });

  return {
    deleteLead,
    createOrUpdate,
    exportLead,
  };
}
