import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const DOC_TYPES = ["Aadhaar Card", "Passport", "Driving Licence", "Voter ID", "PAN Card"];

const docStatusConfig = {
  not_uploaded:    { label: "Not Uploaded",    color: "bg-gray-100 text-gray-500" },
  pending_review:  { label: "Under Review",    color: "bg-blue-100 text-blue-600" },
  verified:        { label: "Verified ✓",      color: "bg-green-100 text-green-700" },
  rejected:        { label: "Rejected",        color: "bg-red-100 text-red-600" },
};

const bookingStatusColor = {
  confirmed: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-600",
};

function MyBookings() {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [activeDocBooking, setActiveDocBooking] = useState(null); // booking _id with open upload panel
  const [docType, setDocType]         = useState(DOC_TYPES[0]);
  const [docPreview, setDocPreview]   = useState(null); // base64
  const [docError, setDocError]       = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/bookings/my", true)
      .then((r) => r.json())
      .then((d) => { setBookings(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancellingId(id);
    try {
      const res = await api.put(`/api/bookings/${id}/cancel`, {}, true);
      if (res.ok) setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b));
    } finally { setCancellingId(null); }
  };

  const handleFileChange = (e) => {
    setDocError("");
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setDocError("Please upload an image file (JPG, PNG, etc.)"); return; }
    if (file.size > 2 * 1024 * 1024) { setDocError("File too large. Max 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setDocPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (bookingId) => {
    if (!docPreview) { setDocError("Please select a document image first."); return; }
    setUploadingId(bookingId);
    setDocError("");
    try {
      const res = await api.put(`/api/bookings/${bookingId}/document`, { document: docPreview, documentType: docType }, true);
      const data = await res.json();
      if (!res.ok) { setDocError(data.error || "Upload failed"); return; }
      setBookings((prev) => prev.map((b) =>
        b._id === bookingId ? { ...b, documentStatus: "pending_review", documentType: docType } : b
      ));
      setActiveDocBooking(null);
      setDocPreview(null);
    } catch { setDocError("Upload failed. Try again."); }
    finally { setUploadingId(null); }
  };

  const openUpload = (bookingId) => {
    setActiveDocBooking(bookingId);
    setDocPreview(null);
    setDocError("");
    setDocType(DOC_TYPES[0]);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-gray-500">Loading your bookings...</div>
  );

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#f8f5f0]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif mb-2 text-gray-800">My Bookings</h1>
        <p className="text-gray-500 mb-10">Your booking history at Aurevia Grand</p>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">You have no bookings yet.</p>
            <button onClick={() => navigate("/hotel")}
              className="bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-700 transition">
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => {
              const nights = b.checkIn && b.checkOut
                ? Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)))
                : null;
              const ds = docStatusConfig[b.documentStatus] || docStatusConfig.not_uploaded;
              const canUpload = b.status !== "cancelled" && b.documentStatus !== "verified";
              const isOpen = activeDocBooking === b._id;

              return (
                <div key={b._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  {/* Main booking info */}
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{b.hotelId?.name || "Hotel"}</h2>
                        <p className="text-gray-500 text-sm">{b.roomType || "Room"}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bookingStatusColor[b.status] || "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </div>

                    {/* Check-in / Check-out highlight */}
                    {(b.checkIn || b.checkOut) && (
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1 bg-[#f8f5f0] rounded-xl p-3 text-center">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Check-in</p>
                          <p className="text-gray-800 font-semibold">
                            {b.checkIn ? new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </p>
                        </div>
                        <div className="flex items-center text-gray-400 font-bold">→</div>
                        <div className="flex-1 bg-[#f8f5f0] rounded-xl p-3 text-center">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Check-out</p>
                          <p className="text-gray-800 font-semibold">
                            {b.checkOut ? new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </p>
                        </div>
                        {nights && (
                          <div className="flex-1 bg-yellow-50 rounded-xl p-3 text-center">
                            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-yellow-700 font-bold">{nights} night{nights !== 1 ? "s" : ""}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>👤 {b.guests || 1} guest{b.guests !== 1 ? "s" : ""}</span>
                      <span>💰 ₹{b.price}/night{nights ? ` · ₹${b.price * nights} total` : ""}</span>
                      <span>📅 Booked {new Date(b.date || b.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>

                    {/* Document status + actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">ID Verification:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ds.color}`}>{ds.label}</span>
                        {b.documentType && <span className="text-xs text-gray-400">({b.documentType})</span>}
                      </div>

                      <div className="flex gap-2">
                        {canUpload && (
                          <button onClick={() => isOpen ? setActiveDocBooking(null) : openUpload(b._id)}
                            className="text-sm px-4 py-2 rounded-full border border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition font-medium">
                            {b.documentStatus === "not_uploaded" ? "Upload ID" : "Re-upload ID"}
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button onClick={() => cancelBooking(b._id)} disabled={cancellingId === b._id}
                            className="text-sm px-4 py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition font-medium disabled:opacity-50">
                            {cancellingId === b._id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rejection reason */}
                    {b.documentStatus === "rejected" && b.documentRejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        ⚠️ Rejection reason: {b.documentRejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Document upload panel (inline) */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                      <h3 className="font-semibold text-gray-700 mb-4">Upload Government ID</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ID Type</label>
                          <select value={docType} onChange={(e) => setDocType(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white">
                            {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload Image</label>
                          <div
                            onClick={() => fileRef.current.click()}
                            className="w-full border-2 border-dashed border-gray-300 hover:border-yellow-400 rounded-xl p-4 text-center cursor-pointer transition">
                            <p className="text-gray-500 text-sm">Click to select image (JPG/PNG, max 2MB)</p>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </div>
                        </div>
                      </div>

                      {docPreview && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Preview</p>
                          <img src={docPreview} alt="Document preview" className="max-h-48 rounded-xl border border-gray-200 object-contain" />
                        </div>
                      )}

                      {docError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{docError}</div>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button onClick={() => handleUpload(b._id)} disabled={uploadingId === b._id || !docPreview}
                          className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-semibold transition text-sm">
                          {uploadingId === b._id ? "Uploading..." : "Submit for Verification"}
                        </button>
                        <button onClick={() => setActiveDocBooking(null)}
                          className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
