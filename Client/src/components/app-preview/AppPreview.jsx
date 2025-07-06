// components/AppPreviewSection.jsx
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";

const screenshots = [
  "/assets/Screenshot 2025-07-06 001538.png",
  "/assets/Screenshot 2025-07-06 001558.png",
  "/assets/Screenshot 2025-07-06 001538.png",
];

export default function AppPreview() {
  const timerRef = useRef();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 1.1 } },
    },
  });

  useEffect(() => {
    const slider = instanceRef.current;
    if (!slider) return;

    timerRef.current = setInterval(() => {
      slider.next();
    }, 3500);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [instanceRef]);

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Wallet in Your Pocket
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          Manage your money, send and receive funds, and view history — all from your phone.
        </p>

        {/* 📱 Phone mockup + carousel */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-[300px] md:w-[350px] aspect-[9/19] bg-gray-900 border-8 border-gray-700 rounded-3xl shadow-xl overflow-hidden relative">
            <div ref={sliderRef} className="keen-slider h-full">
              {screenshots.map((src, index) => (
                <div key={index} className="keen-slider__slide flex justify-center items-center bg-black">
                  <img src={src} alt={`App screen ${index + 1}`} className="h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🎥 Video demo */}
        <div className="relative mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-gray-700 mb-10">
          <video
            src="/assets/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
          ></video>
          <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none" />
        </div>

        {/* 🚀 CTA Button */}
        <div className="mt-6">
          <a
            href="#"
            className="inline-block bg-green-500 text-black font-semibold px-6 py-3 rounded-full text-sm md:text-base hover:bg-green-400 transition duration-300 shadow-md hover:shadow-lg"
          >
            Download the App / Join Now
          </a>
        </div>
      </div>

      {/* 💫 Background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/10 rounded-full blur-3xl z-0" />
    </section>
  );
}
