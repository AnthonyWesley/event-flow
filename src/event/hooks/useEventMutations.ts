import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { eventService } from "../services/eventService";
import { useModalStore } from "../../store/useModalStore";
import usePartner from "../../partner/hooks/usePartner";
import { useNavigate } from "react-router-dom";

import { useTourStore } from "../../store/useTourStore";

export function useEventMutations() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const { setNextTour } = useTourStore();
  const {
    queryPartner: { data: partner },
  } = usePartner();

  const toggleStatus = useMutation({
    mutationFn: eventService.switchStatus,
    onSuccess: (isActive) => {
      navigate(`${isActive ? `/` : "/events"}`),
        toast.success("Status do evento atualizado!");
      closeModal("RankingPageEventToggleForm");
      closeModal("EventsPageEventToggleForm");
      setNextTour("firstEvent");
    },

    onError: (error: any) => {
      if (error.response.status === 409) {
        toast.warning(
          `Seu plano permite ter apenas ${partner?.maxConcurrentEvents} evento ativo por vez.`,
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
    onSuccess: (data) => {
      toast.success("Evento salvo com sucesso!");
      closeModal("RankingPageEventForm");
      closeModal("RankingPageEventForm2");
      closeModal("EventsPageEventForm");
      closeModal("EventsDetailPageEventForm");
      // const newId = newEvent?.id ?? event?.id;
      navigate(`/events/${data.id}`);
      setNextTour("activeEvent");
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

  const exportEvent = useMutation({
    mutationFn: eventService.export,
    onSuccess: ({ blob, fileName }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Evento exportado com sucesso!");
      closeModal("LeadPageDeleteForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["leadsData"] });
      queryClient.invalidateQueries({ queryKey: ["leadData"] });
      queryClient.invalidateQueries({ queryKey: ["leadsByEventData"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erro ao exportar evento");
    },
  });

  return {
    exportEvent,
    toggleStatus,
    deleteEvent,
    createOrUpdate,
  };
}
