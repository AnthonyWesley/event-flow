import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { partnerService } from "../services/partnerService";
import { useModalStore } from "../../store/useModalStore";
import { playSong } from "../../helpers/playSong";
import register from "/sounds/register.mp3";

export function usePartnerMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const approve = useMutation({
    mutationFn: partnerService.approve,
    onSuccess: (data: any) => {
      if (data.status === "Action approved") {
        toast.success("Venda Aprovada!");
        playSong(register);
      }
      if (data.status === "Action rejected") toast.success("Venda Rejeitado!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["salesData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["guestData"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsData"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao salvar product"),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: any }) =>
      partnerService.update(id ?? "", data),
    onSuccess: () => {
      toast.success("Minhas informações atualizadas com sucesso!");
      closeModal("PartnerPagePartnerForm");
      closeModal("AdmPageForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerData"] });
      queryClient.invalidateQueries({ queryKey: ["partnersData"] });
    },
    onError: (err: any) =>
      toast.error(
        err.response?.data?.message || "Erro ao atualizar minhas informações",
      ),
  });

  return {
    // deleteProduct,
    update,
    approve,
  };
}
