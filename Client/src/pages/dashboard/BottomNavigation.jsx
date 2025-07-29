import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Home, ChartNoAxesCombined, WalletCards, CreditCard, LayoutPanelLeft } from 'lucide-react';
import useUIStore from '@/stores/uiStore';

const BottomNavigation = () => {

  const isEditProfileModalOpen = useUIStore((state) => state.isEditProfileModalOpen);

   if (isEditProfileModalOpen) return null;

  const navItems = [
    { name: 'Home', icon: Home, route: "/wallet" },
    { name: 'Transactions', icon: ChartNoAxesCombined, route: "/transactions" },
    { name: 'Pay', icon: WalletCards, route: "/transfer" },
    { name: 'Cards', icon: CreditCard, route: "/card" },
    { name: 'More', icon: LayoutPanelLeft, route: "#" }
  ];

  const isActive = (route) => location.pathname === route

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-20 bg-white border-t rounded-tr-3xl rounded-tl-3xl border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const itemIsActive = isActive(item.route);
            
            return (
              <Link
                key={item.name}
                to={item.route}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
              >
                <div className={`p-2 rounded-lg transition-colors duration-200 ${
                  itemIsActive 
                    ? 'bg-blue-100' 
                    : 'hover:bg-gray-100'
                }`}>
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-200 ${
                      itemIsActive 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`} 
                  />
                </div>
                <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                  itemIsActive 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;






