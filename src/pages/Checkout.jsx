import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

function Checkout() {
  const { hotelId, roomIndex } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: user?.firstName || "",
    contact: "",
    guests: 1,
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get(`/api/hotels/${hotelId}`)
      .then((res) => res.json())
      .then((data) => {
        setHotel(data);
        setRoom(data.rooms?.[roomIndex]);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load room details."); setLoading(false); });
  }, [hotelId, roomIndex, user, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.checkIn || !form.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/api/bookings", {
        hotelId,
        roomIndex: parseInt(roomIndex),
        ...form,
      }, true);

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking failed"); return; }
      navigate("/booking-success");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-gray-500">Loading room details...</div>
  );

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 md:px-10 py-16">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-yellow-600 mb-6 inline-block">
          ← Back
        </button>

        <h1 className="text-3xl font-serif text-gray-800 mb-2">Complete Your Booking</h1>
        <p className="text-gray-500 mb-8">You're booking a {room?.type} at {hotel?.name}</p>

        {/* Room Summary */}
        {room && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 flex gap-4 items-center">
            <img
              src={room.image}
              alt={room.type}
              className="w-28 h-20 object-cover rounded-xl"
              onError={(e) => { e.target.src = "https://placehold.co/120x80?text=Room"; }}
            />
            <div>
              <h2 className="font-semibold text-lg text-gray-800">{room.type}</h2>
              <p className="text-gray-500 text-sm">{room.guests} max guests</p>
              <p className="text-yellow-600 font-bold">₹{room.price} / night</p>
              {nights > 0 && (
                <p className="text-gray-700 font-semibold mt-1">
                  Total: ₹{room.price * nights} for {nights} night{nights !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm mb-6 p-3 rounded-xl">{error}</div>
        )}

        <form onSubmit={handleBooking} className="bg-white rounded-2xl p-8 shadow-md space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="Your contact number"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check-in</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check-out</label>
              <input
                type="date"
                required
                min={form.checkIn || new Date().toISOString().split("T")[0]}
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Guests</label>
            <select
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) })}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {Array.from({ length: room?.guests || 6 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>{g} Guest{g !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 text-white py-4 rounded-xl font-semibold text-lg transition"
          >
            {submitting ? "Confirming..." : `Confirm Booking${nights > 0 ? ` — ₹${(room?.price || 0) * nights}` : ""}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
