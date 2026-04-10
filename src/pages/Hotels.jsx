import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/hotels")
      .then((res) => res.json())
      .then((data) => { setHotels(data); setLoading(false); })
      .catch(() => { setError("Failed to load hotels."); setLoading(false); });
  }, []);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
      Loading hotels...
    </div>
  );

  return (
    <div className="bg-[#f8f5f0] min-h-screen px-6 md:px-10 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-gray-800">Discover Our Hotels</h1>
        <p className="text-gray-500 mt-2">Experience comfort, luxury and elegance.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Search hotel by name..."
          className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="text-center text-red-500 mb-8">{error}</p>}

      {/* Hotels Grid */}
      {filteredHotels.length === 0 && !loading ? (
        <p className="text-center text-gray-500 text-lg mt-16">No hotels found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {filteredHotels.map((h) => (
            <div
              key={h._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Hotel"; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    onClick={() => navigate(`/hotel/${h._id}`)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full font-semibold transition"
                  >
                    View Rooms
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">{h.name}</h2>
                {h.address && <p className="text-gray-400 text-sm mt-1">{h.address}</p>}
                <p className="text-gray-500 mt-1">Starting from</p>
                <p className="text-yellow-600 font-bold text-lg">₹{h.startingPrice} / night</p>

                <button
                  onClick={() => navigate(`/hotel/${h._id}`)}
                  className="mt-4 md:hidden bg-yellow-600 text-white px-4 py-2 rounded-full"
                >
                  View Rooms
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hotels;
