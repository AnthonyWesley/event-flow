import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { eventService } from "../services/eventService";
import { useModalStore } from "../../store/useModalStore";
import usePartner from "../../partner/hooks/usePartner";

export function useEventMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const {
    queryPartner: { data: partner },
  } = usePartner();

  const toggleStatus = useMutation({
    mutationFn: eventService.switchStatus,
    onSuccess: () => {
      toast.success("Status do evento atualizado!");
      closeModal("RankingPageEventToggleForm");
      closeModal("EventsPageEventToggleForm");
    },

    onError: (error: any) => {
      if (error.response.status === 409) {
        toast.error(
          `Seu plano somente pode ter ${partner?.maxConcurrentEvents} evento ativo por vez.`,
        );
      } else
        toast.error(
          error.response?.data?.message || "Erro ao atualizar status",
        );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["eventData"] });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: eventService.delete,
    onSuccess: () => {
      toast.success("Evento excluido com sucesso!");
      closeModal("RankingPageEventDeleteForm");
      closeModal("EventsPageEventDeleteForm");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao excluir evento"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["eventData"] });
    },
  });

  const createOrUpdate = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: any }) =>
      id ? eventService.update(id, data) : eventService.create(data),
    onSuccess: () => {
      toast.success("Evento salvo com sucesso!");
      closeModal("RankingPageEventForm");
      closeModal("RankingPageEventForm2");
      closeModal("EventsPageEventForm");
      closeModal("EventsPageDetailPageEventForm");
    },
    onError: (err: any) => {
      toast.error(
        err.response.status === 409
          ? "Somente 1 evento deve está ativo por vez!"
          : "Erro ao salvar evento",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["eventData"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsData"] });
    },
  });

  return {
    toggleStatus,
    deleteEvent,
    createOrUpdate,
  };
}
