import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spin from "../../components/Spin";
import { SelectList } from "../../components/Select";
import { useEvent } from "../../event/hooks/useEvent";
import Counter from "../../components/Counter";
import { useSaleMutations } from "../hooks/useSaleMutations";
import { useGuestMutations } from "../../guest/hooks/useGuestMutations";
import { SellerOutputDto } from "../../seller/services/sellerService";
import useProduct from "../../product/hooks/useProduct";
import AccessExpiredWrapper from "../../components/AccessExpiredWrapper";
import { SelectCombobox } from "../../components/SelectCombobox";
import Card from "../../components/Card";

export type SaleProps = {
  eventId?: string;
  guestId?: string;
  isGuest?: boolean;
};

export default function SaleForm({ eventId, guestId, isGuest }: SaleProps) {
  const {
    queryEvent: { data: event },
  } = useEvent(eventId);

  const [product, setProduct] = useState<SelectList>();
  const [quantity, setQuantity] = useState<number>();
  const [seller, setSeller] = useState<SelectList>();

  const { createOrUpdate } = useSaleMutations();
  const { createOrUpdate: createOrUpdateGuest } = useGuestMutations();

  const {
    queryProducts: { data: products },
  } = useProduct();

  const isGuestSeller = event?.allSellers.filter(
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

    if (!event?.isActive) {
      toast.error("Para realizar vendas, o evento precisa está ativo.");
      return;
    } else if (!guestId) {
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
    if (event) {
      const defaultSeller = isGuest ? isGuestSeller[0] : event.allSellers[0];

      if (!seller && defaultSeller) {
        setSeller(defaultSeller);
      }
    }
  }, [event, isGuest]);

  useEffect(() => {
    if (!product && products?.length > 0) {
      setProduct(products[0]);
    }
  }, [products]);

  if (!event || !product) return <Spin />;
  return (
    <Card key={eventId ?? ""} className="bg-rose w-full py-1">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">Registro de Venda</h1>

        <SelectCombobox
          label="Vendedor"
          selectList={isGuest ? isGuestSeller : event.allSellers}
          onChange={setSeller}
          // selected={seller}
        />

        <SelectCombobox
          label="Produto"
          selectList={products}
          onChange={setProduct}
          // selected={product}
        />

        <Counter label="Quantidade:" onChange={setQuantity} />
        <AccessExpiredWrapper>
          <button
            type="submit"
            disabled={createOrUpdate.isPending}
            className="bg-gray w-full rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {createOrUpdate.isPending ? "Salvando..." : "Salvar"}
          </button>
        </AccessExpiredWrapper>
      </form>
    </Card>
  );
}
