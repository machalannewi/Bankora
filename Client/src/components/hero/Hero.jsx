import { Link } from "react-router-dom"
import { motion } from 'framer-motion';
import "../../global.css"


const Hero = () => {
  return (
    <div id="home" className="-my-4 lg:-my-24">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="flex items-center gap-3 rounded-full px-4 h-7 text-sm text-gray-600 bg-white/80 backdrop-blur-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 shadow-sm transition-all duration-200">
              <img className="h-10 w-10 rounded-full object-cover" src="/assets/hero-image.png" alt="Trusted users" />
              <span className="font-medium">Trusted by 21,000+ people</span>
            </div>
          </div>
         </motion.div>
          <div className="text-center">
            <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
              Fastest way to manage<br />
              payment anytime you want
            </h1>
         </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mt-8 font-medium text-pretty text-gray-600 sm:text-xl/8">
              Fast, secure payments between friends, family and businesses
            </p>
          </motion.div>
              <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-x-6">
                <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link
                  to="/register"
                  className="w-full md:w-auto rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-center"
                >
                  Get started
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link 
                  to="#" 
                  className="w-full md:w-auto flex items-center justify-center gap-x-2 rounded-full shadow-gray-500 bg-white px-6 py-3 text-sm font-semibold text-black shadow-xs"
                >
                  <img className="w-5 h-5" src="/assets/apple.png" alt="appleIcon" />
                  <span>Download on App Store</span>
                </Link>
              </motion.div>
              </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero