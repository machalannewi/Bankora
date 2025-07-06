// components/Footer.jsx
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold">Bankora</h3>
          <p className="text-sm text-gray-400 mt-2">
            Instant, secure money transfer — no account numbers needed.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-2 text-sm">
          <a href="#" className="text-gray-300 hover:text-white">About</a>
          <a href="#" className="text-gray-300 hover:text-white">Features</a>
          <a href="#" className="text-gray-300 hover:text-white">How It Works</a>
          <a href="#" className="text-gray-300 hover:text-white">Contact</a>
        </div>

        {/* Socials */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Bankora. All rights reserved.
      </div>
    </footer>
  );
}
