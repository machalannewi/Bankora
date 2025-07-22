// components/AppPreviewSection.jsx
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";
import "keen-slider/keen-slider.min.css";

const screenshots = [
  "/assets/visit-website.png",
  "/assets/create-account.png",
  "/assets/login.png",
  "/assets/user-dashboard.png",
];

export default function AppPreview() {
  const timerRef = useRef();

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { 
      perView: 1, 
      spacing: 0  // Remove spacing to prevent gaps
    },
    // Remove the breakpoint that was causing 1.1 slides to show
    breakpoints: {
      "(min-width: 768px)": { 
        slides: { 
          perView: 1,  // Keep exactly 1 slide visible
          spacing: 0 
        } 
      },
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
      <div className="max-w-6xl mx-auto px-4 text-center items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Wallet in Your Pocket
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          Manage your money, send and receive funds, and view history — all from your phone.
        </p>

        {/* 📱 iOS Phone mockup + carousel */}
        <div className="flex justify-center items-center mb-16">
          <div className="relative w-[320px] md:w-[350px]">
            {/* Phone frame */}
            <div className="bg-black rounded-[3rem] p-2 shadow-2xl relative mx-auto">
              {/* Screen */}
              <div className="bg-black rounded-[2.5rem] overflow-hidden relative">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20"></div>
                
                {/* Screen content container with fixed dimensions */}
                <div className="relative w-full h-[600px] md:h-[600px] overflow-hidden rounded-[2.3rem]">
                  <div ref={sliderRef} className="keen-slider w-full h-full">
                    {screenshots.map((src, index) => (
                      <div key={index} className="keen-slider__slide w-full h-full flex items-center justify-center bg-black">
                        <img 
                          src={src} 
                          alt={`App screen ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60 z-20"></div>
              </div>
            </div>
            
            {/* Side buttons */}
            <div className="absolute left-[-3px] top-20 w-1 h-12 bg-gray-800 rounded-l-lg"></div>
            <div className="absolute left-[-3px] top-36 w-1 h-16 bg-gray-800 rounded-l-lg"></div>
            <div className="absolute left-[-3px] top-56 w-1 h-16 bg-gray-800 rounded-l-lg"></div>
            <div className="absolute right-[-3px] top-48 w-1 h-20 bg-gray-800 rounded-r-lg"></div>
          </div>
        </div>

        {/* 🎥 Video demo */}
        <div className="relative mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-gray-700 mb-10">
          <video
            src="/assets/app-recording.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
          ></video>
          <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none" />
        </div>

        {/* 🚀 CTA Button */}
        <div className="mt-6 flex justify-center">          
          <a
            href="#"
            className="flex justify-center items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full text-sm md:text-base transition duration-300 shadow-md hover:shadow-lg"
          >
            <img className="w-6 h-6" src="/assets/apple.png" alt="appleIcon" />
            <span>Download the App / Join Now</span>
          </a>
        </div>
      </div>

      {/* 💫 Background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/10 rounded-full blur-3xl z-0" />
    </section>
  );
}