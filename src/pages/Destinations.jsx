import { useEffect } from "react";
import HeroSlider from "../Components/Heroslider";

function Destinations() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 },
    );

    reveals.forEach((el) => observer.observe(el));
  }, []);

  return (
    <>
      <HeroSlider />

      {/* Why Choose Us */}
      <section className="py-24 px-10 text-center bg-white reveal">
        <h2 className="text-4xl font-serif text-gray-800 mb-12">
          Why Choose Our Destinations
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-600">
              Prime Locations
            </h3>
            <p className="text-gray-600">
              Located in the heart of each city, offering seamless access to
              culture, heritage, and business hubs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-600">
              Curated Experiences
            </h3>
            <p className="text-gray-600">
              Personalized stays crafted with attention to every detail.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-600">
              Timeless Luxury
            </h3>
            <p className="text-gray-600">
              A blend of heritage charm and modern elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Signature CTA Section */}
      <section className="bg-[#1c1c1c] text-white py-24 text-center reveal">
        <h2 className="text-4xl font-serif mb-6">Begin Your Journey Today</h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Experience refined hospitality across India’s most celebrated
          destinations.
        </p>

        <button
          onClick={() => (window.location.href = "/hotel")}
          className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-full font-semibold transition"
        >
          Explore Hotels
        </button>
      </section>
    </>
  );
}

export default Destinations;
