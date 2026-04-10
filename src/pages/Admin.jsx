import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../utils/api";

/* ── helpers ── */
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const nights = (ci, co) => ci && co ? Math.max(1, Math.ceil((new Date(co) - new Date(ci)) / 86400000)) : null;

const bookingStatusColor = {
  confirmed: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-600",
};

const docStatusConfig = {
  not_uploaded:   { label: "No Document",     color: "bg-gray-100 text-gray-500" },
  pending_review: { label: "Needs Review",    color: "bg-blue-100 text-blue-600" },
  verified:       { label: "Verified ✓",      color: "bg-green-100 text-green-700" },
  rejected:       { label: "Rejected",        color: "bg-red-100 text-red-600" },
};

/* ═══════════════════════════════════════════════════════════ */
function Admin() {
  const [hotels, setHotels]             = useState([]);
  const [bookings, setBookings]         = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [manageRoomsHotel, setManageRoomsHotel] = useState(null);
  const [selectedBooking, setSelectedBooking]   = useState(null); // for doc review modal
  const [rejectionReason, setRejectionReason]   = useState("");
  const [docFilter, setDocFilter]       = useState("all"); // all | pending_review | verified | rejected
  const location = useLocation();
  const activeTab = new URLSearchParams(location.search).get("tab") || "dashboard";

  useEffect(() => {
    api.get("/api/hotels").then((r) => r.json()).then(setHotels);
    api.get("/api/bookings", true).then((r) => r.json()).then((d) => setBookings(Array.isArray(d) ? d : []));
  }, []);

  const totalRevenue = bookings.reduce((s, b) => s + (b.price || 0), 0);
  const pendingDocs  = bookings.filter((b) => b.documentStatus === "pending_review").length;

  /* ── hotel CRUD ── */
  const handleDeleteHotel = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;
    const res = await api.delete(`/api/hotels/${id}`, true);
    if (res.ok) setHotels((p) => p.filter((h) => h._id !== id));
  };

  const handleUpdateHotel = async () => {
    const res = await api.put(`/api/hotels/${editingHotel._id}`, editingHotel, true);
    const updated = await res.json();
    setHotels((p) => p.map((h) => h._id === updated._id ? updated : h));
    setEditingHotel(null);
  };

  /* ── document verification ── */
  const handleVerifyDoc = async (bookingId, action) => {
    const res = await api.put(`/api/bookings/${bookingId}/verify-document`,
      { action, rejectionReason: action === "reject" ? rejectionReason : undefined }, true);
    if (res.ok) {
      setBookings((p) => p.map((b) =>
        b._id === bookingId
          ? { ...b, documentStatus: action === "verify" ? "verified" : "rejected", documentRejectionReason: rejectionReason }
          : b
      ));
      setSelectedBooking(null);
      setRejectionReason("");
    }
  };

  /* ── filtered bookings ── */
  const displayedBookings = docFilter === "all"
    ? bookings
    : bookings.filter((b) => b.documentStatus === docFilter);

  /* ═══════ RENDER ═══════ */
  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6 md:p-10">

      {/* ── DASHBOARD ── */}
      {activeTab === "dashboard" && (
        <>
          <h1 className="text-3xl font-serif mb-2 text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mb-8">Overview of hotel operations</p>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Hotels"   value={hotels.length}               icon="🏨" />
            <StatCard title="Total Bookings" value={bookings.length}             icon="📋" />
            <StatCard title="Total Revenue"  value={`₹${totalRevenue.toLocaleString()}`} icon="💰" />
            <StatCard title="Docs to Review" value={pendingDocs}
              icon="📄" highlight={pendingDocs > 0} />
          </div>

          <h2 className="text-xl font-serif mb-4 text-gray-800">Recent Bookings</h2>
          <BookingsTable bookings={bookings.slice(0, 6)} onViewDoc={setSelectedBooking} compact />
        </>
      )}

      {/* ── HOTELS ── */}
      {activeTab === "hotels" && (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-serif text-gray-800">Manage Hotels</h1>
              <p className="text-gray-500 text-sm">{hotels.length} hotel{hotels.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full font-semibold transition">
              + Add Hotel
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white p-6 rounded-2xl shadow-md">
                <img src={hotel.image} className="h-40 w-full object-cover rounded-xl mb-4" alt={hotel.name}
                  onError={(e) => { e.target.src = "https://placehold.co/400x160?text=Hotel"; }} />
                <h2 className="font-semibold text-lg text-gray-800">{hotel.name}</h2>
                <p className="text-gray-400 text-sm mb-1">{hotel.address || "No address"}</p>
                <p className="text-yellow-600 font-semibold mb-1">₹{hotel.startingPrice} / night</p>
                <p className="text-xs text-gray-400 mb-4">{hotel.rooms?.length || 0} room{hotel.rooms?.length !== 1 ? "s" : ""}</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setEditingHotel(hotel)} className="px-4 py-2 bg-yellow-600 text-white rounded-full text-sm hover:bg-yellow-700 transition">Edit</button>
                  <button onClick={() => handleDeleteHotel(hotel._id)} className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition">Delete</button>
                  <button onClick={() => setManageRoomsHotel(hotel)} className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition">Rooms</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── BOOKINGS ── */}
      {activeTab === "bookings" && (
        <>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-serif text-gray-800">All Bookings</h1>
              <p className="text-gray-500 text-sm">{bookings.length} total · {pendingDocs} document{pendingDocs !== 1 ? "s" : ""} awaiting review</p>
            </div>

            {/* Filter by doc status */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all",            label: "All" },
                { key: "pending_review", label: `Needs Review (${pendingDocs})` },
                { key: "verified",       label: "Verified" },
                { key: "rejected",       label: "Rejected" },
                { key: "not_uploaded",   label: "No Document" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setDocFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    docFilter === key ? "bg-yellow-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <BookingsTable bookings={displayedBookings} onViewDoc={setSelectedBooking} />
        </>
      )}

      {/* ── MODALS ── */}
      {editingHotel && (
        <Modal title="Edit Hotel" onClose={() => setEditingHotel(null)}>
          <Input label="Name" value={editingHotel.name} onChange={(v) => setEditingHotel({ ...editingHotel, name: v })} />
          <Input label="Address" value={editingHotel.address || ""} onChange={(v) => setEditingHotel({ ...editingHotel, address: v })} />
          <Input label="Starting Price" type="number" value={editingHotel.startingPrice} onChange={(v) => setEditingHotel({ ...editingHotel, startingPrice: v })} />
          <Input label="Image URL" value={editingHotel.image} onChange={(v) => setEditingHotel({ ...editingHotel, image: v })} />
          <ModalActions onCancel={() => setEditingHotel(null)} onSave={handleUpdateHotel} />
        </Modal>
      )}

      {showAddModal && (
        <AddHotelModal onClose={() => setShowAddModal(false)} onAdd={(h) => setHotels((p) => [...p, h])} />
      )}

      {manageRoomsHotel && (
        <ManageRooms hotel={manageRoomsHotel} onClose={() => setManageRoomsHotel(null)} />
      )}

      {/* Document review modal */}
      {selectedBooking && (
        <DocumentReviewModal
          booking={selectedBooking}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onVerify={() => handleVerifyDoc(selectedBooking._id, "verify")}
          onReject={() => handleVerifyDoc(selectedBooking._id, "reject")}
          onClose={() => { setSelectedBooking(null); setRejectionReason(""); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKINGS TABLE
═══════════════════════════════════════════════════════════ */
function BookingsTable({ bookings, onViewDoc, compact = false }) {
  if (bookings.length === 0)
    return <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-400">No bookings found</div>;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[900px]">
        <thead className="border-b bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-5 py-4">Guest</th>
            <th className="px-5 py-4">Hotel / Room</th>
            <th className="px-5 py-4">Check-in</th>
            <th className="px-5 py-4">Check-out</th>
            <th className="px-5 py-4">Nights</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Document</th>
            {!compact && <th className="px-5 py-4">Action</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => {
            const n   = nights(b.checkIn, b.checkOut);
            const ds  = docStatusConfig[b.documentStatus] || docStatusConfig.not_uploaded;
            const needsReview = b.documentStatus === "pending_review";
            return (
              <tr key={b._id || i} className={`border-b hover:bg-gray-50 transition ${needsReview ? "bg-blue-50/40" : ""}`}>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-800">{b.customerName || b.userId?.firstName || "—"}</p>
                  <p className="text-xs text-gray-400">{b.userId?.email || b.contact || ""}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium">{b.hotelId?.name || "—"}</p>
                  <p className="text-xs text-gray-400">{b.roomType || "—"} · {b.guests || 1} guest{b.guests !== 1 ? "s" : ""}</p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-700">{fmt(b.checkIn)}</span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-700">{fmt(b.checkOut)}</span>
                </td>
                <td className="px-5 py-4">
                  {n ? <span className="font-semibold text-yellow-700">{n}N</span> : "—"}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-yellow-600 font-semibold">₹{b.price || 0}/night</p>
                  {n && <p className="text-xs text-gray-400">₹{(b.price || 0) * n} total</p>}
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bookingStatusColor[b.status] || ""}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ds.color}`}>{ds.label}</span>
                  {b.documentType && <p className="text-xs text-gray-400 mt-1">{b.documentType}</p>}
                </td>
                {!compact && (
                  <td className="px-5 py-4">
                    {b.document ? (
                      <button onClick={() => onViewDoc(b)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          needsReview
                            ? "bg-blue-600 text-white hover:bg-blue-700 animate-pulse"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}>
                        {needsReview ? "Review Now" : "View Doc"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOCUMENT REVIEW MODAL
═══════════════════════════════════════════════════════════ */
function DocumentReviewModal({ booking, rejectionReason, setRejectionReason, onVerify, onReject, onClose }) {
  const ds = docStatusConfig[booking.documentStatus] || docStatusConfig.not_uploaded;
  const n  = nights(booking.checkIn, booking.checkOut);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Document Verification</h2>
            <p className="text-gray-500 text-sm mt-1">{booking.customerName} · {booking.hotelId?.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stay summary */}
          <div className="grid grid-cols-3 gap-3">
            <InfoBox label="Check-in"  value={fmt(booking.checkIn)} />
            <InfoBox label="Check-out" value={fmt(booking.checkOut)} />
            <InfoBox label="Duration"  value={n ? `${n} night${n !== 1 ? "s" : ""}` : "—"} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoBox label="Room"   value={`${booking.roomType || "—"} · ${booking.guests || 1} guest${booking.guests !== 1 ? "s" : ""}`} />
            <InfoBox label="Contact" value={booking.contact || "—"} />
          </div>

          {/* Document image */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">
                Submitted ID: <span className="text-yellow-600">{booking.documentType}</span>
              </p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ds.color}`}>{ds.label}</span>
            </div>
            <img
              src={booking.document}
              alt="Guest ID document"
              className="w-full rounded-xl border border-gray-200 object-contain max-h-72 bg-gray-50"
            />
          </div>

          {/* Rejection reason */}
          {booking.documentStatus !== "verified" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Rejection Reason (required only if rejecting)
              </label>
              <input
                type="text"
                placeholder="e.g. Document blurry, ID expired, name mismatch..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {booking.documentStatus !== "verified" && (
              <button onClick={onVerify}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
                ✓ Approve Document
              </button>
            )}
            {booking.documentStatus !== "rejected" && (
              <button onClick={onReject} disabled={!rejectionReason}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition">
                ✗ Reject Document
              </button>
            )}
            <button onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-[#f8f5f0] rounded-xl p-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-gray-800 font-medium text-sm">{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
function StatCard({ title, value, icon, highlight }) {
  return (
    <div className={`p-8 rounded-2xl shadow-md ${highlight ? "bg-blue-50 border border-blue-200" : "bg-white"}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold mt-1 ${highlight ? "text-blue-600" : "text-yellow-600"}`}>{value}</h2>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500" />
    </div>
  );
}

function ModalActions({ onCancel, onSave, saveLabel = "Save Changes" }) {
  return (
    <div className="flex justify-end gap-3 mt-2">
      <button onClick={onCancel} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition">Cancel</button>
      <button onClick={onSave} className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition">{saveLabel}</button>
    </div>
  );
}

function AddHotelModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", address: "", startingPrice: "", image: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.startingPrice) return;
    setLoading(true);
    const res = await api.post("/api/hotels", form, true);
    const data = await res.json();
    onAdd(data);
    onClose();
    setLoading(false);
  };

  return (
    <Modal title="Add New Hotel" onClose={onClose}>
      <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
      <Input label="Starting Price" type="number" value={form.startingPrice} onChange={(v) => setForm({ ...form, startingPrice: v })} />
      <Input label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
      <ModalActions onCancel={onClose} onSave={handleSubmit} saveLabel={loading ? "Adding..." : "Add Hotel"} />
    </Modal>
  );
}

function ManageRooms({ hotel, onClose }) {
  const [currentHotel, setCurrentHotel] = useState(hotel);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [roomForm, setRoomForm] = useState({ type: "", price: "", guests: "", image: "" });

  const refresh = async () => {
    const res = await api.get(`/api/hotels/${hotel._id}`);
    setCurrentHotel(await res.json());
  };

  const addRoom = async () => {
    if (!roomForm.type || !roomForm.price) return;
    await api.post(`/api/hotels/${hotel._id}/rooms`, roomForm, true);
    setRoomForm({ type: "", price: "", guests: "", image: "" });
    refresh();
  };

  const deleteRoom = async (i) => {
    if (!window.confirm("Delete this room?")) return;
    await api.delete(`/api/hotels/${hotel._id}/rooms/${i}`, true);
    refresh();
  };

  const updateRoom = async () => {
    const rooms = [...currentHotel.rooms];
    rooms[editingRoomIndex] = { ...rooms[editingRoomIndex], ...roomForm };
    await api.put(`/api/hotels/${hotel._id}`, { ...currentHotel, rooms }, true);
    setEditingRoomIndex(null);
    setRoomForm({ type: "", price: "", guests: "", image: "" });
    refresh();
  };

  return (
    <Modal title={`Rooms — ${currentHotel.name}`} onClose={onClose}>
      <div className="max-h-48 overflow-y-auto mb-6 space-y-2">
        {currentHotel.rooms?.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No rooms yet</p>}
        {currentHotel.rooms?.map((room, i) => (
          <div key={i} className="border rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{room.type}</p>
              <p className="text-xs text-gray-500">₹{room.price} · {room.guests} guests · {room.available ? "Available" : "Booked"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingRoomIndex(i); setRoomForm(room); }}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs hover:bg-yellow-200">Edit</button>
              <button onClick={() => deleteRoom(i)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs hover:bg-red-200">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-gray-700 mb-3">{editingRoomIndex !== null ? "Edit Room" : "Add New Room"}</h3>
      <Input label="Room Type" value={roomForm.type} onChange={(v) => setRoomForm({ ...roomForm, type: v })} />
      <Input label="Price / night" type="number" value={roomForm.price} onChange={(v) => setRoomForm({ ...roomForm, price: v })} />
      <Input label="Max Guests" type="number" value={roomForm.guests} onChange={(v) => setRoomForm({ ...roomForm, guests: v })} />
      <Input label="Image URL" value={roomForm.image} onChange={(v) => setRoomForm({ ...roomForm, image: v })} />

      <div className="flex gap-3 mt-4">
        {editingRoomIndex !== null ? (
          <>
            <button onClick={updateRoom} className="flex-1 bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700 transition">Update Room</button>
            <button onClick={() => { setEditingRoomIndex(null); setRoomForm({ type: "", price: "", guests: "", image: "" }); }}
              className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
          </>
        ) : (
          <button onClick={addRoom} className="flex-1 bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700 transition">Add Room</button>
        )}
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">Close</button>
      </div>
    </Modal>
  );
}

export default Admin;
