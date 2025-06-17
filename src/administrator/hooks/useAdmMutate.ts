import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { admService } from "../services/admService";
import { useNavigate } from "react-router-dom";

export default function useAdmMutate() {
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
  const suspendPartner = useMutation({
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

  return { login, accessPartner, activePartner, suspendPartner };
}
