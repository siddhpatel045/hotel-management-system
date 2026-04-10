// import images from assets index
import { hotel1, hotel2, hotel3, hotel4, hotel5, hotel6 } from "../assets";

export const hotels = {
  national: [
    {
      id: 1,
      name: "Aurevia Grand Mumbai",
      location: "Mumbai, India",
      image: hotel1,
      rating: 5,
      price: "₹18,000 / night",
    },
    {
      id: 2,
      name: "Aurevia Palace Jaipur",
      location: "Jaipur, India",
      image: hotel2,
      rating: 5,
      price: "₹22,000 / night",
    },
    {
      id: 3,
      name: "Aurevia Beach Goa",
      location: "Goa, India",
      image: hotel3,
      rating: 4,
      price: "₹15,000 / night",
    },
  ],

  international: [
    {
      id: 4,
      name: "Aurevia Monaco",
      location: "Monaco",
      image: hotel4, // you can add more images later
      rating: 5,
      price: "$850 / night",
    },
    {
      id: 5,
      name: "Aurevia Dubai",
      location: "Dubai, UAE",
      image: hotel5,
      rating: 5,
      price: "$720 / night",
    },
    {
      id: 6,
      name: "Aurevia Paris",
      location: "Paris, France",
      image: hotel6,
      rating: 5,
      price: "$680 / night",
    },
  ],
};
