import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SellerInputDto, sellerService } from "../services/sellerService";
import { useModalStore } from "../../store/useModalStore";

export function useSellerMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const deleteSeller = useMutation({
    mutationFn: ({
      sellerId,
      eventId,
    }: {
      sellerId: string;
      eventId?: string;
    }) =>
      eventId
        ? sellerService.deleteToEvent(sellerId, eventId)
        : sellerService.delete(sellerId),
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
      sellerId,
      eventId,
      data,
    }: {
      sellerId?: string;
      eventId?: string;
      data: SellerInputDto;
    }) =>
      sellerId
        ? sellerService.update(sellerId, data)
        : sellerService.createOrAttachToEvent(eventId ?? "", data),
    onSuccess: () => {
      toast.success("Vendedor salvo com sucesso!");
      closeModal("VENDEDORESForm");
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
