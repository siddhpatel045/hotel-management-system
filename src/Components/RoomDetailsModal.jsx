import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from "@mui/material";

export default function RoomDetailsModal({ open, onClose, room }) {
  if (!room) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{room.title}</DialogTitle>

      <DialogContent>
        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {room.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Room"
              className="rounded-xl object-cover h-60 w-full"
            />
          ))}
        </div>

        <Typography variant="body1" className="mb-4">
          {room.description}
        </Typography>

        <Typography className="font-semibold mb-2">Amenities:</Typography>
        <ul className="mb-4 list-disc ml-6">
          {room.amenities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Typography className="font-semibold mb-2">Reviews:</Typography>
        <ul className="mb-6 list-disc ml-6">
          {room.reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>

        <Typography className="font-bold text-lg mb-4">{room.price}</Typography>

        <Button variant="contained" fullWidth>
          Book Now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
