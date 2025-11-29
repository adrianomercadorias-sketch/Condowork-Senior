import React from 'react';
import { Search, MessageSquare, Heart, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenChat: () => void;
  userProfile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ onOpenChat, userProfile }) => {
  return (
    <header className="h-20 bg-white px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="w-96">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="busca" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenChat}
            className="relative text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MessageSquare size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="relative text-gray-400 hover:text-gray-600">
            <Heart size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">{userProfile.name}</span>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm group-hover:border-emerald-200 transition-colors">
             <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <ChevronDown size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;