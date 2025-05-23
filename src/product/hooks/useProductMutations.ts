import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProductInputDto, productService } from "../services/productService";
import { useModalStore } from "../../store/useModalStore";

export function useProductMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const deleteProduct = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      toast.success("Produto excluído com sucesso!");
      closeModal("ProductDetailPageDeleteForm");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["productsData"] }),
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao excluir product"),
  });

  const createOrUpdate = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: ProductInputDto }) =>
      id ? productService.update(id, data) : productService.create(data),
    onSuccess: () => {
      toast.success("Produto salvo com sucesso!");
      closeModal("ProductPageProductForm");
      closeModal("ProductDetailPageProductForm");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Erro ao salvar product"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productsData"] });
      queryClient.invalidateQueries({ queryKey: ["guestData"] });
    },
  });

  return {
    deleteProduct,
    createOrUpdate,
  };
}
