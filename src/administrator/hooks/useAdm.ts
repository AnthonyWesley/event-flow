import { useQuery } from "@tanstack/react-query";
import { admService } from "../services/admService";

export default function useAdm(search?: string) {
  const isAdmAuthenticated = Boolean(localStorage.getItem("admAccessToken"));

  const queryPartners = useQuery({
    queryKey: ["partnersData", search],
    queryFn: () => admService.list(search),
    enabled: isAdmAuthenticated,
  });

  // const register = useMutation({
  //   mutationFn: admService.register,
  //   onSuccess: () => {
  //     navigate("/adm/dashboard");
  //   },
  //   onError: (error: any) => {
  //     if (error.response.status === 401) {
  //       toast.error("Esse e-mail já foi cadastrado.");
  //     } else
  //       toast.error(error.response?.data?.message || "Erro ao criar conta");
  //   },
  // });

  return { queryPartners };
}
