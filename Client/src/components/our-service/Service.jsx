// components/BenefitsSection.jsx
import { motion } from 'framer-motion';
import {
  Send,
  Contact,
  ShieldCheck,
  BadgeDollarSign,
} from 'lucide-react';

const benefits = [
  {
    title: "Instant Transfer",
    desc: "Send and receive money in real-time with zero delays.",
    icon: <Send className="h-8 w-8 text-black" />,
  },
  {
    title: "No Account Numbers Needed",
    desc: "All you need is a phone number or email — it’s that simple.",
    icon: <Contact className="h-8 w-8 text-black" />,
  },
  {
    title: "Bank Level Security",
    desc: "We use industry-grade encryption to protect your transactions.",
    icon: <ShieldCheck className="h-8 w-8 text-black" />,
  },
  {
    title: "No Fees",
    desc: "Enjoy seamless transfers with absolutely no hidden charges.",
    icon: <BadgeDollarSign className="h-8 w-8 text-black" />,
  },
];

export default function Service() {
  return (
    <section className="py-16 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          Why Use Our Service?
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.03] transition duration-300 bg-white"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
