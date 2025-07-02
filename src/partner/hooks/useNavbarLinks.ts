import { useLocation, matchPath } from "react-router-dom";
import usePartner from "./usePartner";
import { PRIVATE_ROUTES } from "../../constants/privateRoutes";
import { PUBLIC_ROUTES } from "../../constants/publicRoutes";

export function useNavbarLinks() {
  const location = useLocation();
  const pathname = location.pathname;

  const isAdmAuthenticated = Boolean(localStorage.getItem("admAccessToken"));
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
  const isAdminRoute = pathname.startsWith("/adm");
  const isGuestPage = matchPath("events/:eventId/guest/:sellerId", pathname);

  const {
    queryPartner: { data: partner },
  } = usePartner();

  if (isAdminRoute && isAuthenticated) return undefined;
  if (isGuestPage && isAdmAuthenticated) return undefined;
  if (isAuthenticated && !isAdminRoute) return PRIVATE_ROUTES(partner);
  if (!isAuthenticated && !isAdminRoute) return PUBLIC_ROUTES;
  return undefined;
}
