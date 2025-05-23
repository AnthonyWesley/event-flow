import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SaleInputDto, saleService } from "../services/saleService";
import { useModalStore } from "../../store/useModalStore";
import register from "/sounds/register.mp3";
import { playSong } from "../../helpers/playSong";

export function useSaleMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const deleteSale = useMutation({
    mutationFn: ({ eventId, id }: { eventId: string; id: string }) =>
      saleService.delete(eventId, id),
    onSuccess: () => {
      toast.success("Venda excluído com sucesso!"),
        closeModal("RankingPageSaleForm");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao excluir venda"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      queryClient.invalidateQueries({ queryKey: ["guestData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
    },
  });

  const createOrUpdate = useMutation({
    mutationFn: ({
      eventId,
      data,
      saleId,
    }: {
      eventId: string;
      data: SaleInputDto;
      saleId?: string;
    }) =>
      saleId
        ? saleService.update(eventId ?? "", data, saleId)
        : saleService.create(eventId ?? "", data),
    onSuccess: () => {
      toast.success("Venda salvo com sucesso!");
      playSong(register);
      closeModal("RankingPageSaleForm");
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
      queryClient.invalidateQueries({ queryKey: ["guestData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao salvar vendedor"),
  });

  return {
    createOrUpdate,
    deleteSale,
  };
}
