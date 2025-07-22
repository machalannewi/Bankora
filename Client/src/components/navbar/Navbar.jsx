'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
  { name: 'Home', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'About', href: '#' },
  { name: 'How It Works', href: '#' },
]

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  return (

     <header className="fixed inset-x-0 top-0 z-50 h-20 bg-white">
        <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Bankora</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-4 border-1 p-2 rounded-lg h-14">
            {navigation.map((item) => {
              const isActive = activeTab === item.name;

              return(
              <a 
              key={item.name}
              onClick={() => setActiveTab(item.name)} 
              href={item.href} 
              className="text-sm/6 font-semibold text-gray-900">

              <div className={`h-10 px-3 flex items-center rounded-md transition-colors duration-200 ${
                  isActive && 'bg-gray-200' 
                }`}>
                {item.name}
                </div>
              </a>
              )
            })}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-2">
            <Link to="/login" className="text-sm/6 font-semibold text-white bg-black px-5 py-2 rounded-md">
              Log In
            </Link>
            <Link to="/register" className="text-sm/6 font-semibold text-white bg-black px-5 py-2 rounded-md">
              Sign Up
            </Link>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Bankora</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="">
                    <a href="#" className="mr-2 text-sm/6 font-semibold text-white bg-black px-5 py-2 rounded-md">
                    Log In
                    </a>
                    <a href="#" className="text-sm/6 font-semibold text-white bg-black px-5 py-2 rounded-md">
                    Sign Up
                    </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
  )

}

export default Navbar;
 
