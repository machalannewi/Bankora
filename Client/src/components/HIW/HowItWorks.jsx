// components/HowItWorks.jsx
import { motion } from 'framer-motion';

const steps = [
  {
    step: "STEP 1",
    title: "Enter a phone number or email",
    action: "Send funds instantly with just contact info.",
    image: "/assets/enter-email.png",
  },
  {
    step: "STEP 2",
    title: "Type the amount and send",
    action: "No account numbers. Just send, simple and secure.",
    image: "/assets/enter-amount.png",
  },
  {
    step: "STEP 3",
    title: "Funds delivered instantly",
    action: "Recipient receives it immediately. Done.",
    image: "/assets/alert-dashboard.png",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 text-center">

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-black rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-transform duration-300 hover:-rotate-1 hover:scale-[1.02] text-left"
            >
              <div className="h-56 w-full">
                <img
                  src={step.image}
                  alt={`Step image`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-white mb-1 font-semibold tracking-wide">{step.step}</p>
                <h3 className="text-lg text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-white">{step.action}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
