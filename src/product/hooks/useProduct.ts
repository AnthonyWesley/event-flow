import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export default function useProduct(productId?: string, search?: string) {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const queryProducts = useQuery({
    queryKey: ["productsData", search],
    queryFn: () => productService.list(search),
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const queryProduct = useQuery({
    queryKey: ["productData", productId],
    queryFn: () => productService.findOne(productId ?? ""),
    enabled: isAuthenticated && !!productId,
  });

  return { queryProducts, queryProduct };
}
