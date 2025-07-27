// components/FeaturesSection.jsx
import React from 'react';

const features = [
  {
    title: "Instant Money Transfers",
    description: "Send money to friends, family, or businesses instantly with just a few taps. Our secure platform ensures your transactions are processed immediately, 24/7.",
    image: "/assets/instant-transfer.png",
    icon: "/assets/online-payment.png"
  },
  {
    title: "Smart Savings Goals",
    description: "Set and track your savings goals with our intelligent savings feature. Automatically save spare change from purchases and watch your money grow effortlessly.",
    image: "/assets/savings2.jpg",
    icon: "/assets/savings.png"
  },
  {
    title: "Advanced Security",
    description: "Bank-grade encryption, biometric authentication, and real-time fraud monitoring keep your money and personal information completely secure.",
    image: "/assets/advanced-security.jpg",
    icon: "/assets/payment-method.png"
  },
  {
    title: "Expense Tracking",
    description: "Categorize your spending automatically and get insights into your financial habits. Set budgets and receive smart notifications to stay on track.",
    image: "/assets/expense-tracking.jpg",
    icon: "/assets/expenses.png"
  }
];

export default function Service() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Banking
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience banking reimagined with cutting-edge technology and user-friendly design that puts you in complete control of your finances.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-2xl">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-16 h-16 object-cover"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                  {feature.description}
                </p>
                <button className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors duration-200">
                  Learn more
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div className="flex-1 w-full max-w-lg">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}