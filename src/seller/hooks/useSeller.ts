import { useQuery } from "@tanstack/react-query";
import { sellerService } from "../services/sellerService";

export default function useSeller(sellerId?: string, search?: string) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const querySellers = useQuery({
    queryKey: ["sellers", search],
    queryFn: () => sellerService.list(search),
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const querySeller = useQuery({
    queryKey: ["sellerData", sellerId],
    queryFn: () => sellerService.findOne(sellerId ?? ""),
    enabled: isAuthenticated && !!sellerId,
  });
  return { querySellers, querySeller };
}
