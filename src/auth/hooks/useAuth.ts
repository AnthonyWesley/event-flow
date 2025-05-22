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
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    },
  });

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar conta");
    },
  });

  return { login, register };
}
