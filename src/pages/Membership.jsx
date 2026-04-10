import React from "react";

const plans = [
  {
    name: "Classic",
    price: "₹1,999 / year",
    benefits: ["5% Room Discount", "Early Check-In", "Welcome Beverage"],
  },
  {
    name: "Prestige",
    price: "₹4,999 / year",
    benefits: ["15% Room Discount", "Complimentary Breakfast", "Spa Access"],
  },
  {
    name: "Signature",
    price: "₹9,999 / year",
    benefits: [
      "25% Room Discount",
      "Suite Upgrade",
      "Airport Pickup",
      "Priority Concierge",
    ],
  },
];

const Membership = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f0] py-20 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800">Prestige Circle</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          A refined membership program designed to elevate every stay with
          exclusive privileges and personalized experiences.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {plan.name}
            </h2>

            <p className="text-xl text-yellow-600 font-bold mb-6">
              {plan.price}
            </p>

            <ul className="space-y-3 text-gray-600 mb-8">
              {plan.benefits.map((benefit, i) => (
                <li key={i}>• {benefit}</li>
              ))}
            </ul>

            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full font-semibold transition">
              Join Now
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Membership Designed For Discerning Guests
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From priority reservations to complimentary upgrades, Prestige Circle
          ensures that every stay is memorable.
        </p>
      </div>
    </div>
  );
};

export default Membership;
