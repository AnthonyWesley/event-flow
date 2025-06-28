import { SaleItem, RawSaleType } from "./SaleItem";

type Product = {
  id: string;
  name: string;
  price: number;
};

type Seller = {
  id: string;
  name: string;
};

type SaleListProps = {
  sales: RawSaleType[];
  sellers: Seller[];
  products: Product[];
  eventName?: string;
  isGuest?: boolean;
};

export default function SaleList({
  sales,
  sellers,
  products,
  isGuest,
}: SaleListProps) {
  const sortedItems = [...sales]?.sort(
    (a, b) =>
      new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime(),
  );
  return (
    <ul role="list" className="w-full rounded-sm">
      {sortedItems?.map((sale, index) => (
        <SaleItem
          index={index}
          key={sale.id}
          sale={sale}
          sellers={sellers}
          products={products}
          isGuest={isGuest}
        />
      ))}
    </ul>
  );
}
