const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//
// ========================
// CREATE HOTEL (ADMIN ONLY)
// ========================
router.post("/", auth, admin, async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.json(hotel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//
// ========================
// GET ALL HOTELS (PUBLIC)
// ========================
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// ========================
// GET SINGLE HOTEL BY ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// ========================
// UPDATE HOTEL (ADMIN ONLY)
// ========================
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// ========================
// DELETE HOTEL (ADMIN ONLY)
// ========================
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// ========================
// ADD ROOM TO HOTEL (ADMIN ONLY)
// ========================
router.post("/:id/rooms", auth, admin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    hotel.rooms.push(req.body);
    await hotel.save();

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//
// ========================
// DELETE ROOM FROM HOTEL (ADMIN ONLY)
// ========================
router.delete("/:id/rooms/:roomIndex", auth, admin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    hotel.rooms.splice(req.params.roomIndex, 1);
    await hotel.save();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
