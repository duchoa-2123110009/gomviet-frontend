import { useEffect, useState } from "react";

function Banner() {
  const [banner, setBanner] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/banner-list")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBanner(data);
        } else {
          console.error("API không trả về array:", data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (banner.length > 0 && !isPaused) {
      const timer = setInterval(() => {
        setIndex(prev => (prev + 1) % banner.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banner, isPaused]);

  const goToSlide = (i) => {
    setIndex(i);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % banner.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + banner.length) % banner.length);
  };

  if (!Array.isArray(banner) || banner.length === 0) {
    return (
      <section className="relative h-[500px] w-full overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-amber-300 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-amber-700 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-gray-800">Đang tải banner...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="banner" 
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Banner Container */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        
        {/* Banner Images */}
        {banner.map((item, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === i 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            {/* Image with overlay gradient */}
            <div className="relative w-full h-full">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl animate-fade-in">
                      {item.name}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-lg animate-fade-in-delay">
                      Khám phá vẻ đẹp của nghệ thuật gốm thủ công
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-delay-2">
                      Khám phá ngay →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          ←
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center gap-3">
          {banner.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                index === i 
                  ? "w-12 h-3 bg-white" 
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold">
          {index + 1} / {banner.length}
        </div>

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold flex items-center gap-2">
            <span>⏸</span>
            <span>Paused</span>
          </div>
        )}
      </div>

      {/* Thumbnail Preview (optional) */}
      <div className="hidden lg:block absolute bottom-20 right-8 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {banner.map((item, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`block w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === i 
                ? "border-white scale-110" 
                : "border-white/30 hover:border-white/60"
            }`}
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

export default Banner;