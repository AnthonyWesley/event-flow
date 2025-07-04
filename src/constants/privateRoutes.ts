import { fieldFormatter } from "../helpers/fieldFormatter";
import { PartnerOutputDto } from "../partner/services/partnerService";

export const PRIVATE_ROUTES = (user: PartnerOutputDto) => [
  {
    href: "/",
    text: "Ranking",
    // icon: "mdi:podium-gold",
    icon: "game-icons:podium-winner",
  },
  {
    href: "/events",
    text: "Eventos",
    icon: "carbon:event",
  },
  {
    href: "/sellers",
    text: "Vendedores",
    icon: "mdi:users",
  },
  {
    href: "/products",
    text: "Produtos",
    icon: "iconoir:box-iso",
  },
  {
    href: "/user",
    text: fieldFormatter.name(user?.name, "first"),
    icon: "ri:map-pin-user-fill",
    image: user?.photo,
  },
];
