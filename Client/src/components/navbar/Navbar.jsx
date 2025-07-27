'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
]

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  // Scroll spy effect to update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map(item => ({
        name: item.name,
        element: document.getElementById(item.href.replace('#', ''))
      }));

      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveTab(section.name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId, itemName) => {
    // Remove the # from the href to get the actual ID
    const targetId = sectionId.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Calculate offset to account for fixed navbar (80px = h-20)
      const offsetTop = element.offsetTop - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update active tab
      setActiveTab(itemName);
      
      // Close mobile menu if open
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 bg-white shadow-sm">
      <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <button 
            onClick={() => scrollToSection('#home', 'Home')}
            className="-m-1.5 p-1.5 flex cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl font-bold">Bankora</span>
          </button>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 transition-colors"
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open main menu'}</span>
            {mobileMenuOpen ? (
              <XMarkIcon aria-hidden="true" className="size-6" />
            ) : (
              <Bars3Icon aria-hidden="true" className="size-6" />
            )}
          </button>
        </div>
        
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 lg:hidden">
            {navigation.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href, item.name)}
                  className={`w-full text-left block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 ${
                    isActive ? 'bg-gray-200 border-r-2 border-black' : ''
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="border-t border-gray-200 mt-2 pt-2 px-4 pb-2">
              <Link to="/login" className="inline-block text-sm font-semibold text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Log In
              </Link>
            </div>
          </div>
        )}
        
        <div className="hidden lg:flex lg:gap-x-2 border border-gray-200 p-1 rounded-lg h-14">
          {navigation.map((item) => {
            const isActive = activeTab === item.name;

            return (
              <button 
                key={item.name}
                onClick={() => scrollToSection(item.href, item.name)} 
                className="text-sm/6 font-semibold text-gray-900 transition-all duration-200"
              >
                <div className={`h-10 px-4 flex items-center rounded-md transition-all duration-200 ${
                    isActive ? 'bg-gray-300 shadow-sm' : 'hover:bg-gray-100'
                  }`}>
                  {item.name}
                </div>
              </button>
            )
          })}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-2">
          <Link to="/login" className="text-sm/6 font-semibold text-white bg-black px-5 py-2 rounded-md hover:bg-gray-800 transition-colors">
            Log In
          </Link>
          <Link to="/register" className="text-sm/6 font-semibold text-white bg-black px-5 py-2 rounded-md hover:bg-gray-800 transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;