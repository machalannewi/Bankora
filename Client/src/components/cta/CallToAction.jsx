


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
        <a
          href="#"
          className="inline-block bg-green-500 text-black font-semibold px-8 py-4 rounded-full text-base hover:bg-green-400 transition duration-300 shadow-lg hover:shadow-xl"
        >
          Sign Up Free
        </a>
      </div>
    </section>
  );
}
