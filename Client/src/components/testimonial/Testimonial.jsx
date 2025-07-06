// components/TestimonialCarousel.jsx
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Jane Doe",
    role: "Small Business Owner",
    quote: "I use this app to pay my staff weekly. It’s fast and reliable.",
    image: "/assets/jane.jpg",
  },
  {
    name: "Samuel King",
    role: "Freelancer",
    quote: "No more waiting for bank transfers. It’s instant and secure!",
    image: "/assets/samuel.jpg",
  },
  {
    name: "Amara Yusuf",
    role: "Student",
    quote: "My parents send me money in seconds. So convenient!",
    image: "/assets/amara.jpg",
  },
];

export default function TestimonialCarousel() {
  const timerRef = useRef();
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
  });

  // ✅ Autoplay logic
  useEffect(() => {
    if (!instanceRef.current) return;

    const slider = instanceRef.current;
    clearInterval(timerRef.current); // avoid multiple timers

    timerRef.current = setInterval(() => {
      slider.next();
    }, 4000); // 4 seconds per slide

    return () => {
      clearInterval(timerRef.current); // cleanup on unmount
    };
  }, [instanceRef]);

  return (
    <section className="py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">What Users Are Saying</h2>

        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((t, index) => (
            <div key={index} className="keen-slider__slide">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 text-left mx-2 h-full hover:shadow-lg transition duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">“{t.quote}”</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
