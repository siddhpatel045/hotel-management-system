import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AdminRoute from "./Components/AdminRoute";
import UserRoute from "./Components/UserRoute";
import PublicRoute from "./Components/PublicRoute";

import Destinations from "./pages/Destinations";
import Experiences from "./pages/Experiences";
import Hotels from "./pages/Hotels";
import Offers from "./pages/Offers";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import HotelDetails from "./pages/HotelDetails";
import ManageHotel from "./pages/ManageHotel";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Destinations />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/hotel" element={<Hotels />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking-success" element={<BookingSuccess />} />

            {/* Auth routes — redirect if already logged in */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* User-only routes */}
            <Route path="/my-bookings" element={<UserRoute><MyBookings /></UserRoute>} />
            <Route path="/checkout/:hotelId/:roomIndex" element={<UserRoute><Checkout /></UserRoute>} />

            {/* Admin-only routes */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/admin/hotel/:id" element={<AdminRoute><ManageHotel /></AdminRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
