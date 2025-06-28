import { currencyFormatter } from "../../helpers/currencyFormatter";
import { formatDate } from "../../helpers/formatDate";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSaleMutations } from "../hooks/useSaleMutations";
import Tooltip from "../../components/Tooltip";
import { fieldFormatter } from "../../helpers/fieldFormatter";

type Product = {
  id: string;
  name: string;
  price: number;
};

type Seller = {
  id: string;
  name: string;
};

// type Event = {
//   id: string;
//   name: string;
// };

export type RawSaleType = {
  id: string;
  sellerId: string;
  productId: string;
  eventId: string;
  quantity: number;
  createdAt: string;
};

type SaleItemProps = {
  sale: RawSaleType;
  sellers: Seller[];
  products: Product[];
  index: number;
  isGuest?: boolean;
};

export function SaleItem({
  sale,
  sellers,
  products,
  index,
  isGuest,
}: SaleItemProps) {
  const seller = sellers.find((s) => s.id === sale.sellerId);
  const product = products?.find((p) => p.id === sale.productId);
  const { deleteSale } = useSaleMutations();
  return (
    <li
      key={sale.id}
      className={`flex h-20 w-full items-center justify-between rounded-sm border-b border-b-gray-500/15 p-2 hover:bg-[rgb(29,37,57)] ${index % 2 === 0 ? "bg-slate-900" : "bg-slate-900/15"}`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full min-w-0">
          <div className="min-w-0 flex-auto">
            <p className="mt-1 truncate text-xs/5 text-gray-300">
              {sale.quantity}x {product?.name}
            </p>
            {!isGuest && (
              <p className="text-sm/6 font-semibold">
                {fieldFormatter.name(seller?.name ?? "", "firstTwo")}
              </p>
            )}
            {isGuest && (
              <p className="text-sm/6 font-semibold">
                {/* {seller?.name?.split(" ").slice(0, 1).join(" ")} */}-
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
          <p className="text-sm/6">
            {currencyFormatter.ToBRL((product?.price || 0) * sale?.quantity)}
          </p>
          <p className="mt-1 text-xs/5 text-gray-300">
            {formatDate(sale.createdAt)}
          </p>
        </div>
      </div>
      {!isGuest && (
        <Tooltip info="Deletar">
          <div
            className="ml-2 cursor-pointer self-end rounded-full border border-gray-100/15 p-3 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
            onClick={() =>
              deleteSale.mutate({ eventId: sale.eventId, id: sale.id })
            }
          >
            <Icon
              icon={`${deleteSale.isPending ? "eos-icons:loading" : "material-symbols:delete-sweep-outline-sharp"}`}
              // icon={`"material-symbols:delete-sweep-outline-sharp"`}
              width="25"
            />
          </div>
        </Tooltip>
      )}
    </li>
  );
}
