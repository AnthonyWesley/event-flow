import { useEffect, useState } from "react";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { FormValidator } from "../../helpers/FormValidator";
import { useProductMutations } from "../hooks/useProductMutations";
import { ProductOutputDto } from "../services/productService";
import useProduct from "../hooks/useProduct";
import { toast } from "react-toastify";
import AccessExpiredWrapper from "../../components/AccessExpiredWrapper";
import Card from "../../components/Card";

export type ProductProps = {
  product?: ProductOutputDto;
};

export default function ProductForm({ product }: ProductProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { createOrUpdate } = useProductMutations();
  const {
    queryProducts: { data: products },
  } = useProduct();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(currencyFormatter.ToBRL(product.price));
    }
  }, [product]);
  const clearForm = () => {
    if (!product) {
      setName("");
      setPrice("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = FormValidator.validateAll({ name, price });
    if (isValid) {
      const productAlreadyInExists = products?.some(
        (s: ProductOutputDto) =>
          s.name.toLowerCase() === fieldFormatter.name(name).toLowerCase(),
      );

      if (productAlreadyInExists && !product?.id) {
        toast.error("Produto com o mesmo nome já está cadastrado.");
        return;
      }
      createOrUpdate.mutate(
        {
          id: product?.id,
          data: {
            name: fieldFormatter.name(name),
            price: currencyFormatter.ToNumber(price),
          },
        },
        { onSuccess: clearForm },
      );
    }
  };

  const hasChanges =
    name !== product?.name ||
    currencyFormatter.ToNumber(price) !== product?.price;
  return (
    <Card key={product?.id ?? ""} className="bg-green w-full py-1">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">
          {product?.id ? "Editar Producto" : "Registro de Producto"}
        </h1>
        <label className="flex flex-col">
          Nome:
          <input
            type="text"
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded bg-white/5 p-2"
            required
          />
        </label>
        <label className="flex flex-col">
          Preço:
          <input
            type="text"
            placeholder="R$"
            value={price}
            onChange={(e) => setPrice(currencyFormatter.ToBRL(e.target.value))}
            className="rounded bg-white/5 p-2"
            required
          />
        </label>
        <AccessExpiredWrapper>
          <button
            type="submit"
            disabled={!hasChanges || createOrUpdate.isPending}
            className="bg-gray w-full rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {createOrUpdate.isPending ? "Salvando..." : "Salvar"}
          </button>
        </AccessExpiredWrapper>
      </form>
    </Card>
  );
}
