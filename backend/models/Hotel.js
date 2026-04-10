const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  guests: { type: Number, default: 2 },
  image: String,
  available: { type: Boolean, default: true },
});

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    startingPrice: { type: Number, required: true },
    image: String,
    rooms: { type: [roomSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
