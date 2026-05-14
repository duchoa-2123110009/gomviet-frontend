import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Products from "./pages/Product";
import Workshops from "./pages/Workshop";
import Banner from "./pages/Banner";
import ProductDetail from "./pages/ProductDetail";
import WorkshopDetail from "./pages/WorkshopDetail";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Payment from "./pages/Payment"; 
import StaffPanel from "./components/StaffPanel";
import PrivateRoute from "./components/PrivateRoute"; // ✅ import
import AuthStaff from "./pages/AuthStaff";
import BookingPanel from "./BookingPanel";
import VnpayReturn from "./pages/VnpayReturn";
import PaymentResult from "./pages/PaymentResult";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chính */}
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Home />
              <Workshops />
              <Footer />
            </>
          }
        />

        {/* Product Detail */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Workshop Detail */}
        <Route path="/workshop" element={<WorkshopDetail />} />
        <Route path="/workshop/:id" element={<WorkshopDetail />} />

        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/payment/:bookingId" element={<Payment />} />

        {/* ✅ Staff Panel - chỉ staff hoặc admin mới vào được */}
        <Route path="/auth/staff" element={<AuthStaff />} />
        <Route path="/staff/bookings" element={<BookingPanel />} />
        <Route path="/" element={<div className="text-center py-20 text-2xl font-bold">Trang chủ</div>} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/vnpay-return" element={<VnpayReturn />} />
        <Route path="/payment-result" element={<PaymentResult />} />
<Route
  path="/staff"
  element={
    <PrivateRoute allowedRoles={["staff", "admin"]}>
      <StaffPanel />
    </PrivateRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;