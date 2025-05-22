import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export default function useProduct(productId?: string) {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));
  useProduct;
  const queryProducts = useQuery({
    queryKey: ["productsData"],
    queryFn: productService.list,
    enabled: isAuthenticated,
  });

  const queryProduct = useQuery({
    queryKey: ["productData"],
    queryFn: () => productService.findOne(productId ?? ""),
    enabled: isAuthenticated,
  });

  return { queryProducts, queryProduct };
}
