import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ProductOutputDto,
  productService,
} from "../../product/services/productService";
import Spin from "../../components/Spin";
import Select, { SelectList } from "../../components/Select";
import { useEvent } from "../../event/hooks/useEvent";
import Counter from "../../components/Counter";
import Card from "../../components/Card";
import { useSaleMutations } from "../hooks/useSaleMutations";
import { useGuestMutations } from "../../guest/hooks/useGuestMutations";
import { SellerOutputDto } from "../../seller/services/sellerService";

export type SaleProps = {
  eventId?: string;
  guestId?: string;
  isGuest?: boolean;
};

export default function SaleForm({ eventId, guestId, isGuest }: SaleProps) {
  const { currentEvent } = useEvent();

  const [product, setProduct] = useState<SelectList>();
  const [quantity, setQuantity] = useState<number>();
  const [seller, setSeller] = useState<SelectList>();

  const { createOrUpdate } = useSaleMutations();
  const { createOrUpdate: createOrUpdateGuest } = useGuestMutations();

  const { data: productQuery = [], isPending: productPending } = useQuery({
    queryKey: ["productsData"],
    queryFn: productService.list,
  });

  const productOptions = productQuery.map((product: ProductOutputDto) => ({
    id: product.id,
    name: product.name,
  }));

  const isGuestSeller = currentEvent?.allSellers.filter(
    (se: SellerOutputDto) => se.id === guestId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!quantity || !eventId || !product || !seller) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (guestId) {
      createOrUpdateGuest.mutate({
        data: {
          eventId,
          productId: product.id,
          sellerId: seller.id,
          quantity,
        },
      });
    }

    if (!guestId) {
      createOrUpdate.mutate({
        eventId,
        data: {
          eventId,
          productId: product.id,
          sellerId: seller.id,
          quantity,
        },
      });
    }
  };

  useEffect(() => {
    if (currentEvent) {
      const defaultSeller = isGuest
        ? isGuestSeller[0]
        : currentEvent.allSellers[0];

      if (!seller && defaultSeller) {
        setSeller(defaultSeller);
      }
    }
  }, [currentEvent, isGuest]);

  useEffect(() => {
    if (!product && productOptions.length > 0) {
      setProduct(productOptions[0]);
    }
  }, [productOptions]);

  if (!currentEvent || productPending) return <Spin />;
  return (
    <Card key={eventId ?? ""} color="rose">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">Registro de Venda</h1>
        <Select
          label="Vendedor"
          selectList={isGuest ? isGuestSeller : currentEvent.allSellers}
          onChange={setSeller}
          selected={seller}
        />
        <Select
          label="Produto"
          selectList={productOptions}
          onChange={setProduct}
          selected={product}
        />
        <Counter label="Quantidade:" onChange={setQuantity} />

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
