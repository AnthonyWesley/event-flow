import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { admService } from "../services/admService";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../store/useModalStore";

export default function useAdmMutate() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: admService.login,
    onSuccess: () => {
      navigate("/adm/dashboard");
    },
    onError: (error: any) => {
      if (error.response.status === 401) {
        toast.error("E-mail ou senha incorreta.");
      } else
        toast.error(error.response?.data?.message || "Erro ao fazer login");
    },
  });

  const accessPartner = useMutation({
    mutationFn: admService.impersonate,
    onSuccess: () => {
      navigate("/");
    },

    onError: (error: any) => {
      if (error.response.status === 401) {
        toast.error("E-mail ou senha incorreta.");
      } else
        toast.error(error.response?.data?.message || "Erro ao fazer login");
    },
  });

  const activePartner = useMutation({
    mutationFn: admService.active,
    onSuccess: () => {
      toast.success("Parceiro ativo!");

      closeModal("AdminToggleForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["partnersData"] });
    },
  });
  const suspendPartner = useMutation({
    mutationFn: admService.suspend,
    onSuccess: () => {
      toast.success("Parceiro suspenso!");

      closeModal("AdminToggleForm");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerData"] });
      queryClient.invalidateQueries({ queryKey: ["eventsData"] });
      queryClient.invalidateQueries({ queryKey: ["partnersData"] });
    },
  });

  return { login, accessPartner, activePartner, suspendPartner };
}
