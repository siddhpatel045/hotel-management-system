function PrideSection() {
  return (
    <section className="w-full bg-white py-20">
      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-6 mb-6">
          <span className="hidden md:block w-20 h-px bg-gray-400"></span>

          <h2 className="text-3xl md:text-5xl font-serif tracking-wide text-gray-800">
            INDIA’S PRIDE, WORLD’S STRONGEST
          </h2>

          <span className="hidden md:block w-20 h-px bg-gray-400"></span>
        </div>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          Taj has yet again been recognised as World’s Strongest Hotel Brand and
          India’s Strongest Brand, across sectors, by Brand Finance 2025 Reports
        </p>
      </div>

      {/* Image */}
      <div className="mt-16 flex justify-center px-4">
        <div className="border-4 border-[#b8924a] max-w-6xl w-full">
          <img
            src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250"
            alt="Taj Palace"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default PrideSection;
