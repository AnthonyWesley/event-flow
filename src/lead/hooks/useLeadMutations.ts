import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useModalStore } from "../../store/useModalStore";
import { LeadInputDto, leadService } from "../services/leadService";

export function useLeadMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const deleteSeller = useMutation({
    mutationFn: ({ eventId, leadId }: { eventId: string; leadId: string }) =>
      leadService.delete(eventId, leadId),
    onSuccess: () => {
      toast.success("Vendedor excluido com sucesso!");
      closeModal("SellerDetailPageDeleteSellerForm");
      closeModal("SellerDetailByEventDeleteForm");
      closeModal("GuestPageDeleteForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellersData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["eventData"] });
      queryClient.invalidateQueries({ queryKey: ["guestData"] });
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
    onSuccess: () => {
      toast.success("Vendedor salvo com sucesso!");
      closeModal("SellerPageSellerForm");
      closeModal("RankingPageSellerForm");
      closeModal("SellerDetailPageSellerForm");
      closeModal("SellerDetailByEventSellerForm");
      closeModal("GuestPageSellerForm");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellersData"] });
      queryClient.invalidateQueries({ queryKey: ["sellerData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["eventData"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao salvar vendedor"),
  });

  return {
    deleteSeller,
    createOrUpdate,
  };
}
