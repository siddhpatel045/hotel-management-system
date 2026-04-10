import { room1, room2, room3 } from "../assets";

export const roomTypes = [
  {
    id: 1,
    title: "Executive Suite",
    description: "Spacious suite with city skyline view.",
    price: "₹28,000 / night",
    images: [room1, room2],
    amenities: ["King Bed", "Private Balcony", "Jacuzzi", "Mini Bar"],
    reviews: ["Absolutely stunning experience!", "Best luxury stay ever."],
  },
  {
    id: 2,
    title: "Deluxe Room",
    description: "Elegant design with premium comfort.",
    price: "₹18,000 / night",
    images: [room2, room3],
    amenities: ["Queen Bed", "Smart TV", "Rain Shower"],
    reviews: ["Very comfortable and modern.", "Loved the interiors."],
  },
];
