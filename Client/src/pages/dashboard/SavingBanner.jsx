import React from 'react'
import { ArrowRight } from "lucide-react"

const SavingBanner = () => {
  return (
    <div className="flex justify-between items-center h-40 md:h-60 bg-blue-200 mb-6 rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 md:p-10">
            <p className="text-blue-800 md:text-xl lg:text-3xl font-semibold">New Auto Savings with Friends</p>
            <p className="text-sm md:text-lg lg:text-2xl text-gray-600 mb-4 mt-2 w-[100%]">Turn on auto-contribution for your shared goals and never miss a step</p>
                <button
                 className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 text-blue-800 font-semibold cursor-pointer">
                    <span className="md:text-xl lg:text-3xl">Save Now</span>
                    <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mt-0.5 md:mt-1 lg:mt-1.5 text-white bg-blue-800 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
                    </div>
                    
                </button>
        </div>
        <div className="w-44 md:w-56">
            <img src="/assets/piggy-bank.png" alt="saving picture" />
        </div>
    </div>
  )
}

export default SavingBanner