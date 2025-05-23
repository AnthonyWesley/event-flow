import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import User from "./partner/pages/PartnerPage";
import Sale from "./sale/pages/SalePage";
import Pricing from "./pricing/pages/PricingPage";
import AuthPage from "./auth/pages/AuthPage";
import RankingPage from "./ranking/pages/RankingPage";
import PrivateRoutes from "./auth/pages/PrivateRoutes";
import ProductsPage from "./product/pages/ProductsPage";
import SellersPage from "./seller/pages/SellersPage";
import SellerDetailPage from "./seller/pages/SellerDetailPage";
import ModalInterceptor from "./components/ModalInterceptor";
import ProductDetailPage from "./product/pages/ProductDetailPage";
import EventsPage from "./event/pages/EventsPage";
import EventsPageDetailPage from "./event/pages/EventsPageDetailPage";
import GuestPage from "./guest/pages/GuestPage";
import PendingModal from "./components/PendingModal";
import { PRIVATE_ROUTES } from "./constants/privateRoutes";
import { PUBLIC_ROUTES } from "./constants/publicRoutes";

export default function App() {
  const location = useLocation();
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));
  const isGuestPage = matchPath(
    "events/:eventId/guest/:sellerId",
    location.pathname,
  );
  const state = location.state as { backgroundLocation?: Location };
  return (
    <div className="flex min-h-screen flex-col">
      {isAuthenticated && (
        <>
          {!isGuestPage && <Navbar links={PRIVATE_ROUTES} />}
          {!isGuestPage && <PendingModal />}
        </>
      )}
      {!isAuthenticated && !isGuestPage && <Navbar links={PUBLIC_ROUTES} />}

      <main className="container mx-auto flex flex-1 flex-col px-2">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<PrivateRoutes />}>
            {state?.backgroundLocation && (
              <>
                <Route
                  path="/sellers/:sellerId"
                  element={
                    <ModalInterceptor>
                      <SellerDetailPage />
                    </ModalInterceptor>
                  }
                />
                <Route
                  path="/products/:productId"
                  element={
                    <ModalInterceptor>
                      <ProductDetailPage />
                    </ModalInterceptor>
                  }
                />
              </>
            )}
            <Route index element={<RankingPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventsPageDetailPage />} />
            <Route path="user" element={<User />} />
            <Route path="sellers" element={<SellersPage />} />
            {/* <Route path="sellers/:sellerId" element={<SellerDetailPage />} /> */}
            <Route
              path="/products/:productId"
              element={<ProductDetailPage />}
            />
            <Route path="products" element={<ProductsPage />} />
            <Route path="sales" element={<Sale />} />
          </Route>
          <Route
            path="events/:eventId/guest/:sellerId"
            element={<GuestPage />}
          />
          <Route path="auth" element={<AuthPage />} />
          <Route path="pricing" element={<Pricing />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

{
  /* {dataUser?.name && <FooterNav />}
  <Routes>
    <Route path="/" element={<PrivateRoutes />}>
      <Route index element={<Home />} />
      <Route path="record/:id" element={<Records />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="movements" element={<Movements />} />
      <Route path="categories" element={<Categories />} />
    </Route>

    <Route path="login" element={<UserAuth />} />
  </Routes>
  {dataUser?.name && <HeaderNav />}

  <Toast />
  <Confirm /> */
}
{
  /* {!isAuthPage && <Navbar />} */
}
{
  /* {!isAuthPage && <Footer />} */
}
