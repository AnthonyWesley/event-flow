import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { toast } from "react-toastify";

export default function useAuth() {
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: authService.login,
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

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: any) => {
      if (error.response.status === 401) {
        toast.error("Esse e-mail já foi cadastrado.");
      } else
        toast.error(error.response?.data?.message || "Erro ao criar conta");
    },
  });

  return { login, register };
}
