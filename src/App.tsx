import { Route, Routes } from "react-router-dom";
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
import EventsDetailPage from "./event/pages/EventsDetailPage";
import GuestPage from "./guest/pages/GuestPage";
import ErrorPage from "./auth/pages/ErrorPage";
import AdmAuthPage from "./administrator/pages/AdmAuthPage";
import SellerDetailPage from "./seller/pages/SellerDetailPage";
import LeadPage from "./lead/pages/LeadPage";
import AdminMenu from "./components/AdminMenu";
import AdmPage2 from "./administrator/pages/AdmPage2";
import HomePage from "./home/pages/HomePage";
import { useNavbarLinks } from "./partner/hooks/useNavbarLinks";

export default function App() {
  const isAdmAuthenticated = Boolean(localStorage.getItem("admAccessToken"));

  return (
    <div className="bg-dark scrollbar-transparent flex min-h-screen flex-col">
      <Navbar links={useNavbarLinks()} />

      <main className="container mx-auto mt-20 mb-24 flex flex-1 flex-col px-2 lg:mb-0">
        <ToastContainer />
        <Routes>
          {/* Rotas privadas */}
          <Route path="/" element={<PrivateRoutes />}>
            <Route index element={<RankingPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventsDetailPage />} />
            <Route path="user" element={<User />} />
            <Route path="sellers" element={<SellersPage />} />
            <Route path="sellers/:sellerId" element={<SellerDetailPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:productId" element={<ProductDetailPage />} />
            <Route path="sales" element={<Sale />} />
            <Route path="/:type/:eventId/leads" element={<LeadPage />} />
          </Route>
          <Route
            path="events/:eventId/guest/:sellerId"
            element={<GuestPage />}
          />

          {/* Público */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/unauthorized" element={<ErrorPage code={401} />} />
          <Route path="/not-found" element={<ErrorPage code={403} />} />
          <Route path="*" element={<ErrorPage code={404} />} />

          {/* Admin */}
          {isAdmAuthenticated && (
            <Route path="/adm/dashboard" element={<AdmPage2 />} />
          )}
          <Route path="/adm" element={<AdmAuthPage />} />
        </Routes>

        {isAdmAuthenticated && <AdminMenu />}
      </main>
    </div>
  );
}
