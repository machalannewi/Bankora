import React, { useState } from 'react';
import { Home, Landmark, WalletCards, CreditCard, LayoutPanelLeft } from 'lucide-react';

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Save', icon: Landmark },
    { name: 'Pay', icon: WalletCards },
    { name: 'Security', icon: CreditCard },
    { name: 'More', icon: LayoutPanelLeft }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-20 bg-white border-t rounded-tr-3xl rounded-tl-3xl border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
              >
                <div className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-100' 
                    : 'hover:bg-gray-100'
                }`}>
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`} 
                  />
                </div>
                <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;