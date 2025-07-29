import {motion} from "framer-motion"


export default function CallToAction() {
  return (
    <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-24 text-white overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl opacity-30 z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          Ready to send your first <span className="text-green-400">instant transfer</span>?
        </h2>
        <p className="text-gray-300 mb-8 text-sm md:text-base max-w-xl mx-auto">
          Join thousands of people moving money fast, secure, and with zero fees — all without needing account numbers.
        </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <motion.div
            initial={{opacity: 0, x: -100}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.8}}
            viewport={{ once: true, amount: 0.3 }}
            >
            <button className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
              <img className="w-6 h-6" src="/assets/apple.png" alt="App Store" />
              Download for iOS
            </button>
          </motion.div>
            <motion.div
            initial={{opacity: 0, x: 100}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.8}}
            viewport={{ once: true, amount: 0.3 }}
            >
            <button className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition-colors duration-200 flex items-center gap-2">
              <img className="w-6 h-6" src="/assets/playstore.png" alt="Google Play" />
              Download for Android
            </button>
            </motion.div>
          </div>
      </div>
    </section>
  );
}
