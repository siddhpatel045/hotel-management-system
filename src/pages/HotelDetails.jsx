import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/hotels/${id}`)
      .then((res) => res.json())
      .then((data) => { setHotel(data); setLoading(false); })
      .catch(() => { setError("Failed to load hotel."); setLoading(false); });
  }, [id]);

  const handleBook = (roomIndex) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/checkout/${hotel._id}/${roomIndex}`);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-gray-600 text-xl">
      Loading luxury rooms...
    </div>
  );

  if (error || !hotel) return (
    <div className="h-screen flex flex-col items-center justify-center text-gray-600 gap-4">
      <p>{error || "Hotel not found."}</p>
      <button onClick={() => navigate("/hotel")} className="text-yellow-600 underline">
        Browse all hotels
      </button>
    </div>
  );

  return (
    <div className="bg-[#f8f5f0] min-h-screen px-6 md:px-10 py-16">
      {/* Hotel Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/hotel")}
          className="text-sm text-gray-500 hover:text-yellow-600 transition mb-4 inline-flex items-center gap-1"
        >
          ← Back to Hotels
        </button>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif text-gray-800 mb-3">{hotel.name}</h1>
        {hotel.address && <p className="text-gray-500">{hotel.address}</p>}
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Choose from our curated selection of premium rooms designed for elegance and comfort.
        </p>
      </div>

      {hotel.rooms?.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No rooms available for this hotel yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        {hotel.rooms?.map((room, i) => (
          <div
            key={i}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={room.image}
                className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                alt={room.type}
                onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Room"; }}
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    room.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {room.available ? "Available" : "Booked"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{room.type}</h2>
              <p className="text-gray-500">{room.guests} Guests</p>
              <p className="text-yellow-600 font-bold text-lg mt-2">₹{room.price} / night</p>

              <button
                disabled={!room.available}
                onClick={() => handleBook(i)}
                className={`mt-6 w-full py-3 rounded-full font-semibold transition ${
                  room.available
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {room.available ? "Book This Room" : "Not Available"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelDetails;
