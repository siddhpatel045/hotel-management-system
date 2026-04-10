const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const verifyToken = require("../middleware/verifyToken");
const auth = require("../middleware/auth");

// CREATE BOOKING
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!hotelId || roomIndex === undefined)
      return res.status(400).json({ error: "hotelId and roomIndex are required" });

    // Validate guests
    if (!guests || guests < 1 || guests > 10) {
      return res.status(400).json({ error: "Number of guests must be between 1 and 10" });
    }

    // Validate phone number (Indian format: starts with 6-9, 10 digits total, may have +91 or 0 prefix)
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(contact)) {
      return res.status(400).json({ error: "Invalid Indian phone number. Please enter a 10-digit number starting with 6-9." });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: "Invalid check-in or check-out date" });
    }

    if (checkInDate < today) {
      return res.status(400).json({ error: "Check-in date cannot be in the past" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const room = hotel.rooms[roomIndex];
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (!room.available) return res.status(400).json({ error: "Room is not available" });

    hotel.rooms[roomIndex].available = false;
    hotel.markModified("rooms");
    await hotel.save();

    const booking = new Booking({
      userId: req.user.id,
      hotelId,
      roomIndex,
      roomType: room.type,
      price: room.price,
      customerName,
      contact,
      guests,
      checkIn,
      checkOut,
      date: new Date(),
    });

    await booking.save();
    res.json({ message: "Booking successful", booking });
  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET MY BOOKINGS (USER)
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("hotelId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPLOAD DOCUMENT (USER)
router.put("/:id/document", auth, async (req, res) => {
  try {
    const { document, documentType } = req.body;
    if (!document || !documentType)
      return res.status(400).json({ error: "Document and type are required" });

    // Validate it's a base64 image
    if (!document.startsWith("data:image/"))
      return res.status(400).json({ error: "Only image files are accepted" });

    // ~2MB limit (base64 is ~1.33x original)
    if (document.length > 2.7 * 1024 * 1024)
      return res.status(400).json({ error: "File too large. Max 2MB." });

    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.document = document;
    booking.documentType = documentType;
    booking.documentStatus = "pending_review";
    booking.documentRejectionReason = null;
    await booking.save();

    res.json({ message: "Document uploaded successfully", documentStatus: booking.documentStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CANCEL BOOKING (USER)
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "cancelled") return res.status(400).json({ error: "Already cancelled" });

    booking.status = "cancelled";
    await booking.save();

    const hotel = await Hotel.findById(booking.hotelId);
    if (hotel && hotel.rooms[booking.roomIndex]) {
      hotel.rooms[booking.roomIndex].available = true;
      hotel.markModified("rooms");
      await hotel.save();
    }

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL BOOKINGS (ADMIN)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });

    const bookings = await Booking.find()
      .populate("hotelId", "name")
      .populate("userId", "firstName email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// VERIFY / REJECT DOCUMENT (ADMIN)
router.put("/:id/verify-document", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });

    const { action, rejectionReason } = req.body; // action: "verify" | "reject"
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (action === "verify") {
      booking.documentStatus = "verified";
      booking.documentRejectionReason = null;
    } else if (action === "reject") {
      booking.documentStatus = "rejected";
      booking.documentRejectionReason = rejectionReason || "Document not accepted";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await booking.save();
    res.json({ message: `Document ${action}d`, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
