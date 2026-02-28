import React from 'react';
import { FiMenu, FiBell, FiUser, FiSettings } from 'react-icons/fi';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="mr-4 rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NS MeetAI</h1>
                <p className="text-xs text-gray-500">智能会议纪要助手</p>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100">
              <FiBell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
              <FiSettings className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-gray-900">Rain</p>
                <p className="text-xs text-gray-500">管理员</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                <FiUser className="h-4 w-4 text-primary-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;