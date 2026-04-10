import React from "react";

const offers = [
  {
    title: "Weekend Escape - 30% Off",
    desc: "Enjoy a luxurious weekend getaway at a special discounted price.",
    tag: "Limited Time",
  },
  {
    title: "Couple Special Package",
    desc: "Romantic decor, candlelight dinner & complimentary spa.",
    tag: "Romantic",
  },
  {
    title: "Early Bird Booking",
    desc: "Book 30 days in advance & save big on your stay.",
    tag: "Save More",
  },
];

const Offers = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white py-16 px-6">
      <h1 className="text-5xl font-bold text-center mb-4">Exclusive Offers</h1>
      <p className="text-center text-gray-400 mb-16">
        Indulge in curated luxury experiences at irresistible prices.
      </p>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="relative bg-[#1c1c1c] border border-yellow-500 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition duration-300"
          >
            <span className="absolute top-4 right-4 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
              {offer.tag}
            </span>

            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
              {offer.title}
            </h2>
            <p className="text-gray-300 mb-6">{offer.desc}</p>

            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full font-semibold transition">
              Grab Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
