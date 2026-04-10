import { useEffect, useState } from "react";
import { hero1, hero2, hero3 } from "../assets";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: hero1,
    title: "Experience Luxury",
    subtitle: "Iconic Destinations",
    description: "Timeless hospitality crafted for the modern traveler.",
  },
  {
    image: hero2,
    title: "Unforgettable Stays",
    subtitle: "World Class Hotels",
    description: "Where elegance meets comfort in every detail.",
  },
  {
    image: hero3,
    title: "Moments That Matter",
    subtitle: "Curated Experiences",
    description: "Personalized journeys designed for you.",
  },
];

function Heroslider() {
  const [current, setCurrent] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[100vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Layer (slow movement) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: `center ${scrollY * 0.3}px`,
            }}
          />

          {/* Foreground Layer (faster movement) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex items-center px-24 text-white">
            <div className="max-w-xl">
              <p className="mb-4 text-sm tracking-[0.35em] uppercase text-yellow-400">
                {slide.subtitle}
              </p>

              <h1 className="text-6xl font-serif leading-tight">
                {slide.title}
              </h1>

              <p className="mt-6 text-lg opacity-90">{slide.description}</p>

              <button
                onClick={() => navigate("/hotel")}
                className="mt-8 bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-full font-semibold transition"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              current === index ? "bg-yellow-500 w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Heroslider;
