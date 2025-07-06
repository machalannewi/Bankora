// components/SecuritySection.jsx
import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, AlertTriangle } from 'lucide-react';

const securityPoints = [
  {
    title: "Bank-Level Encryption",
    description: "All your data and transactions are protected with 256-bit SSL encryption — just like the banks.",
    icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Two-Factor Authentication",
    description: "We support 2FA for every login or fund transfer to add an extra layer of protection.",
    icon: <LockKeyhole className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Real-Time Fraud Monitoring",
    description: "Our system automatically detects suspicious activity and notifies you instantly.",
    icon: <AlertTriangle className="w-8 h-8 text-green-600" />,
  },
];

export default function SecuritySection() {
  return (
    <section className="py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-14">Security You Can Trust</h2>

        <div className="grid gap-10 md:grid-cols-3">
          {securityPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  {point.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-gray-600">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
