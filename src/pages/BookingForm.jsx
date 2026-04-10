import { useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

function BookingForm({ hotelId, roomIndex, onClose }) {
  const [data, setData] = useState({
    customerName: "",
    age: "",
    guests: "",
    contact: "",
    checkIn: "",
    checkOut: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!data.customerName || !data.age || !data.guests || !data.contact || !data.checkIn || !data.checkOut) {
      return "All fields are required";
    }
    if (parseInt(data.age) < 18) {
      return "Primary guest must be at least 18 years old";
    }
    if (parseInt(data.guests) < 1 || parseInt(data.guests) > 10) {
      return "Number of guests must be between 1 and 10";
    }
    // Indian Phone format
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(data.contact)) {
      return "Invalid Indian phone number. Please enter a 10-digit number.";
    }

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) return "Check-in date cannot be in the past";
    if (checkOutDate <= checkInDate) return "Check-out date must be after check-in date";

    return null;
  };

  const book = async (e) => {
    e.preventDefault();
    setError("");
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/bookings", {
        ...data,
        hotelId,
        roomIndex,
        age: parseInt(data.age),
        guests: parseInt(data.guests)
      });
      
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Booking failed");
        return;
      }

      alert("Booking successful! Redirecting to your bookings...");
      navigate("/my-bookings");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-sm";
  const labelStyle = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg mx-auto border border-gray-100">
      <h3 className="text-2xl font-serif text-center mb-6 text-[#8B6B2E]">Complete Your Reservation</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm mb-6 p-3 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={book} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Guest Name</label>
            <input
              className={inputStyle}
              placeholder="e.g. Rahul Sharma"
              value={data.customerName}
              onChange={(e) => setData({ ...data, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className={labelStyle}>Phone Number</label>
            <input
              className={inputStyle}
              placeholder="10-digit mobile"
              value={data.contact}
              onChange={(e) => setData({ ...data, contact: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Your Age</label>
            <input
              type="number"
              className={inputStyle}
              placeholder="18+"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
            />
          </div>
          <div>
            <label className={labelStyle}>Total Guests</label>
            <input
              type="number"
              className={inputStyle}
              placeholder="1-10"
              value={data.guests}
              onChange={(e) => setData({ ...data, guests: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Check-In</label>
            <input
              type="date"
              className={inputStyle}
              value={data.checkIn}
              onChange={(e) => setData({ ...data, checkIn: e.target.value })}
            />
          </div>
          <div>
            <label className={labelStyle}>Check-Out</label>
            <input
              type="date"
              className={inputStyle}
              value={data.checkOut}
              onChange={(e) => setData({ ...data, checkOut: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold transition"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="flex-[2] bg-[#C9A24D] hover:bg-[#b8913f] disabled:opacity-60 text-white py-3 rounded-xl font-bold transition shadow-md"
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
