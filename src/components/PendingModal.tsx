import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "../helpers/formatDate";
import useProduct from "../product/hooks/useProduct";
import useSeller from "../seller/hooks/useSeller";
import usePartner from "../partner/hooks/usePartner";
import { usePartnerMutations } from "../partner/hooks/usePartnerMutations";
import SlideBar from "./SlideBar";
import Tooltip from "./Tooltip";
import { useEffect, useRef } from "react";
import notificationSound from "/sounds/notification.mp3";
import { playSong } from "../helpers/playSong";
import { fieldFormatter } from "../helpers/fieldFormatter";
import { useEvent } from "../event/hooks/useEvent";

type NotificationType = "create" | "update" | "delete";

interface PendingSale {
  id: string;
  eventName: string;
  sellerName: string;
  sellerImage: string;
  notificationType: NotificationType;
  saleInfo: {
    amount: number;
    product: string;
    date: string;
    quantity: number;
  };
}

function getNotificationLabel(type: NotificationType) {
  switch (type) {
    case "create":
      return "Nova Venda";
    case "update":
      return "Venda Atualizada";
    case "delete":
      return "Venda Deletada";
    default:
      return "";
  }
}

function mapNotificationsToPendingSales(
  notifications: any[],
  sellers: any[],
  products: any[],
  events: any[],
): PendingSale[] {
  return notifications.map((notification) => {
    const seller = sellers.find((s) => s.id === notification.sellerId);
    const product = products.find(
      (p) => p.id === notification.payload.productId,
    );
    const event = events.find((e) => e.id === notification.eventId);

    return {
      id: notification.id,
      eventName: event?.name,
      sellerName: seller?.name,
      sellerImage: seller?.photo,
      notificationType: notification.actionType
        .replace("_SALE", "")
        .toLowerCase() as NotificationType,
      saleInfo: {
        amount: (product?.price || 0) * (notification.payload.quantity || 1),
        product: product?.name,
        date: formatDate(notification.createdAt),
        quantity: notification.payload.quantity || 1,
      },
    };
  });
}

export default function PendingModal() {
  const { approve } = usePartnerMutations();
  const {
    queryPartnerNotifications: { data: notifications = [] },
  } = usePartner();

  const {
    queryEvents: { data: events = [] },
  } = useEvent();

  const {
    queryProducts: { data: products = [] },
  } = useProduct();

  const {
    querySellers: { data: sellers = [] },
  } = useSeller();

  const prevCount = useRef(0);
  useEffect(() => {
    if (notifications.length > prevCount.current) {
      playSong(notificationSound);
    }
    prevCount.current = notifications.length;
  }, [notifications.length]);

  const pendingSales = mapNotificationsToPendingSales(
    notifications,
    sellers,
    products,
    events,
  );

  return (
    <SlideBar
      icon={
        <Tooltip alert={notifications.length > 0 && notifications.length}>
          <Icon icon="material-symbols:notifications-active" width="30" />
        </Tooltip>
      }
      className="bg-slate-950/95"
      sliderSide="left"
      pushButtonOnSlide={false}
    >
      <ul
        role="list"
        className="rounded-lgp-2 h-full w-[280px] divide-y divide-gray-500 overflow-x-scroll"
      >
        {pendingSales.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-10">
            <Icon icon="arcticons:pokemon-sleep" width="80" />
            <p className="text-base"> Sem notificações no momento! </p>
          </div>
        )}
        {pendingSales.map((sale) => (
          <li
            key={sale.id}
            className="flex flex-col gap-1 border-b border-gray-500/15 py-2"
          >
            <h1>{sale.eventName}</h1>
            <div className="flex items-center gap-4">
              <img
                src={sale.sellerImage}
                alt={sale.sellerName}
                className="size-12 rounded-full bg-gray-50"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {fieldFormatter.name(sale.sellerName, "firstTwo")}
                </p>
                <p className="text-xs text-gray-400">
                  {getNotificationLabel(sale.notificationType)}
                </p>
              </div>
            </div>

            <div className="flex rounded-md p-3 text-sm text-gray-300">
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-sm font-semibold text-gray-50">
                  {sale.saleInfo.product}
                </p>
                <p className="mt-1 text-xs text-gray-300">
                  {sale.saleInfo.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-gray-50">
                  {sale.saleInfo.quantity} und
                </p>
                <p className="mt-1 text-xs text-gray-300">
                  {sale.saleInfo.date}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="w-full rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-500"
                onClick={() =>
                  approve.mutate({ pendingActionId: sale.id, approve: true })
                }
              >
                {approve.isPending ? "..." : "Aprovar"}
              </button>

              <button
                className="w-full rounded-md bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-500"
                onClick={() =>
                  approve.mutate({ pendingActionId: sale.id, approve: false })
                }
              >
                {approve.isPending ? "..." : "Recusar"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </SlideBar>
  );
}
