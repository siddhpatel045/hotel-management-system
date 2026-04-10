import React from "react";

const experiences = [
  {
    title: "Luxury Spa Retreat",
    description: "Relax your body and mind with our world-class spa therapies.",
    image: "/images/spa.png",
  },
  {
    title: "Fine Dining Experience",
    description: "Indulge in gourmet cuisine crafted by top chefs.",
    image: "/images/finedinning.png",
  },
  {
    title: "Infinity Pool Escape",
    description: "Swim into the horizon with breathtaking sunset views.",
    image: "/images/infinitypool.png",
  },
  {
    title: "Private Beach Dinner",
    description: "Romantic candlelight dinner under the stars.",
    image: "/images/privatedinner.png",
  },
];

const Experiences = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501117716987-c8e1ecb210f1)",
        }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <h1 className="relative text-white text-5xl font-bold z-10">
          Unforgettable Experiences
        </h1>
      </div>

      {/* Experiences Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Curated For Your Stay
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <img
                src={exp.image}
                alt={exp.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                <p className="text-gray-600 text-sm">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-black text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Signature Royal Evening</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-300">
          Enjoy a curated evening with live music, chef's tasting menu, and
          panoramic rooftop views.
        </p>
      </div>
    </div>
  );
};

export default Experiences;
