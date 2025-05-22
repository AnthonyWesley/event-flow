import { useEffect, useState } from "react";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { FormValidator } from "../../helpers/FormValidator";
import { useProductMutations } from "../hooks/useProductMutations";
import { ProductOutputDto } from "../services/productService";
import Card from "../../components/Card";

export type ProductProps = {
  product?: ProductOutputDto;
};

export default function ProductForm({ product }: ProductProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { createOrUpdate } = useProductMutations();

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
  return (
    <Card key={product?.id ?? ""} color="green">
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

        <button
          type="submit"
          disabled={createOrUpdate.isPending}
          className="bg-gray rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {createOrUpdate.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </Card>
  );
}
