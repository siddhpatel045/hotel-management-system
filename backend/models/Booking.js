const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomIndex: { type: Number, required: true },
    roomType: String,
    price: Number,
    customerName: String,
    contact: String,
    guests: { type: Number, default: 1 },
    checkIn: Date,
    checkOut: Date,
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    // Document verification
    document: {
      type: String,   // base64 data URL of uploaded ID
      default: null,
    },
    documentType: {
      type: String,   // "Aadhaar", "Passport", "Driving Licence", etc.
      default: null,
    },
    documentStatus: {
      type: String,
      enum: ["not_uploaded", "pending_review", "verified", "rejected"],
      default: "not_uploaded",
    },
    documentRejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
