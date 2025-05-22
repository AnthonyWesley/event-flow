import { useQuery } from "@tanstack/react-query";
import { sellerService } from "../services/sellerService";

export default function useSeller(sellerId?: string) {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  const querySellers = useQuery({
    queryKey: ["sellersData"],
    queryFn: sellerService.list,
    enabled: isAuthenticated,
  });

  const querySeller = useQuery({
    queryKey: ["sellerData", sellerId],
    queryFn: () => sellerService.findOne(sellerId ?? ""),
    enabled: isAuthenticated && !!sellerId,
  });
  return { querySellers, querySeller };
}
