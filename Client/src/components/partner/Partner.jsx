import React from 'react';

const PartnersSection = () => {
  // Banking and fintech company logos data
  const partners = [
    { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
    { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
    { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    { name: 'American Express', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg' },
    { name: 'Bank of America', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Bank_of_America_1998.svg' },
    { name: 'Wells Fargo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Wells_Fargo_Bank.svg' },
    { name: 'JPMorgan Chase', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_of_JPMorganChase_2024.svg' },
    { name: 'Goldman Sachs', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg' },
    { name: 'Citibank', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Citi.svg' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Financial Institutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We partner with the world's most trusted financial companies to provide you with secure and reliable banking services.
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* First Row - Left to Right */}
          <div className="flex animate-scroll-left mb-8 space-x-12">
            {/* First set of logos */}
            <div className="flex items-center space-x-12 min-w-max">
              {partners.slice(0, 5).map((partner, index) => (
                <div key={`row1-set1-${index}`} className="flex-shrink-0">
                  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-12 w-auto max-w-[120px] object-contain group-hover:grayscale-0 transition-all duration-300 group-hover:opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-12 min-w-max">
              {partners.slice(0, 5).map((partner, index) => (
                <div key={`row1-set2-${index}`} className="flex-shrink-0">
                  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-12 w-auto max-w-[120px] object-contain group-hover:grayscale-0 transition-all duration-300 group-hover:opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="flex animate-scroll-right space-x-12">
            {/* First set of logos */}
            <div className="flex items-center space-x-12 min-w-max">
              {partners.slice(5, 10).map((partner, index) => (
                <div key={`row2-set1-${index}`} className="flex-shrink-0">
                  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-12 w-auto max-w-[120px] object-contain transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-12 min-w-max">
              {partners.slice(5, 10).map((partner, index) => (
                <div key={`row2-set2-${index}`} className="flex-shrink-0">
                  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-12 w-auto max-w-[120px] object-contain transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }

        /* Pause animation on hover */
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default PartnersSection;