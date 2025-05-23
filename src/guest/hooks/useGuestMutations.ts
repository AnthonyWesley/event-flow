import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { guestService } from "../services/guestService";
import { SaleInputDto } from "../../sale/services/saleService";
import { useModalStore } from "../../store/useModalStore";

export function useGuestMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const deleteSale = useMutation({
    mutationFn: ({ data, id }: { data: SaleInputDto; id: string }) =>
      guestService.delete("DELETE_SALE", data, id),
    onSuccess: () => {
      toast.success("Solicitação enviada!");
      closeModal("GuestPageSaleForm");
    },

    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao excluir venda"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsData"] });
    },
  });

  const createOrUpdate = useMutation({
    mutationFn: ({ data, saleId }: { data: SaleInputDto; saleId?: string }) =>
      saleId
        ? guestService.update("UPDATE_SALE", data, saleId)
        : guestService.create("CREATE_SALE", data),
    onSuccess: () => {
      toast.warning("Solicitação enviada!");
      closeModal("GuestPageSaleForm");
    },
    onMutate: async (newSale) => {
      await queryClient.cancelQueries({ queryKey: ["salesData"] });
      const previous = queryClient.getQueryData(["salesData"]);
      queryClient.setQueryData(["salesData"], (old: any) => [
        ...(old || []),
        newSale,
      ]);
      return { previous };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sellersData"] });
      queryClient.invalidateQueries({ queryKey: ["sellerData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["guestData"] });
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsData"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao salvar vendedor"),
  });

  // const sendEmail = useMutation({
  //   mutationFn: ({
  //     eventId,
  //     sellerId,
  //   }: {
  //     eventId: string;
  //     sellerId: string;
  //   }) => guestService.sendInvitation(eventId, sellerId),
  //   onSuccess: () => {
  //     toast.success("Convite enviado com sucesso!");
  //   },

  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["sellersData"] });
  //     queryClient.invalidateQueries({ queryKey: ["eventsData"] });
  //   },
  //   onError: (err: any) =>
  //     toast.error(err.response?.data?.message || "Erro ao salvar vendedor"),
  // });

  return {
    createOrUpdate,
    deleteSale,
    // sendEmail,
  };
}
