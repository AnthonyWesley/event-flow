import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import User from "./partner/pages/PartnerPage";
import Sale from "./sale/pages/SalePage";
import Pricing from "./pricing/pages/PricingPage";
import AuthPage from "./auth/pages/AuthPage";
import RankingPage from "./ranking/pages/RankingPage";
import PrivateRoutes from "./auth/pages/PrivateRoutes";
import ProductsPage from "./product/pages/ProductsPage";
import SellersPage from "./seller/pages/SellersPage";
import ProductDetailPage from "./product/pages/ProductDetailPage";
import EventsPage from "./event/pages/EventsPage";
import EventsPageDetailPage from "./event/pages/EventsPageDetailPage";
import GuestPage from "./guest/pages/GuestPage";
import PendingModal from "./components/PendingModal";
import { PRIVATE_ROUTES } from "./constants/privateRoutes";
import { PUBLIC_ROUTES } from "./constants/publicRoutes";
import ErrorPage from "./auth/pages/ErrorPage";
import AdmPage from "./administrator/pages/AdmPage";
import AdmAuthPage from "./administrator/pages/AdmAuthPage";
import SellerDetailPage from "./seller/pages/SellerDetailPage";
export default function App() {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
  const isAdmAuthenticated = Boolean(localStorage.getItem("admAccessToken"));
  // const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  const isGuestPage = matchPath(
    "events/:eventId/guest/:sellerId",
    location.pathname,
  );
  return (
    <div className="flex min-h-screen flex-col">
      {isAuthenticated && (
        <>
          {!isGuestPage && <Navbar links={PRIVATE_ROUTES} />}
          {!isGuestPage && <PendingModal />}
        </>
      )}
      {!isAuthenticated && !isGuestPage && <Navbar links={PUBLIC_ROUTES} />}

      <main className="container mx-auto mb-26 flex flex-1 flex-col px-2 lg:mb-0">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<PrivateRoutes />}>
            <Route index element={<RankingPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventsPageDetailPage />} />
            {/* <Route path="events/:eventId" element={<ActiveEventPage />} /> */}
            <Route path="user" element={<User />} />
            <Route path="sellers" element={<SellersPage />} />
            <Route path="sellers/:sellerId" element={<SellerDetailPage />} />
            <Route
              path="/products/:productId"
              element={<ProductDetailPage />}
            />
            <Route path="products" element={<ProductsPage />} />
            <Route path="sales" element={<Sale />} />
            <Route
              path="events/:eventId/guest/:sellerId"
              element={<GuestPage />}
            />
          </Route>
          <Route path="auth" element={<AuthPage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="/unauthorized" element={<ErrorPage code={401} />} />
          <Route path="/not-found" element={<ErrorPage code={403} />} />
          <Route path="*" element={<ErrorPage code={404} />} />
          {isAdmAuthenticated && (
            <Route path="/adm/dashboard" element={<AdmPage />} />
          )}
          <Route path="/adm" element={<AdmAuthPage />} />
        </Routes>
        {/* <Footer /> */}
      </main>
    </div>
  );
}
