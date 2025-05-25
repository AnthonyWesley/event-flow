import { useQuery } from "@tanstack/react-query";
import { sellerService } from "../services/sellerService";

export default function useSeller(sellerId?: string) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const querySellers = useQuery({
    queryKey: ["sellersData"],
    queryFn: sellerService.list,
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
