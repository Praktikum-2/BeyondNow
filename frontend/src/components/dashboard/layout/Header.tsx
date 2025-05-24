import React, { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  X,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  FileText,
  LayoutDashboard,
} from "lucide-react";

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className='sticky top-0 z-30 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-between h-16 px-4 sm:px-6'>
        {/* Left section with menu and title */}
        <div className='flex items-center'>
          <button
            onClick={onToggleSidebar}
            className='p-2 mr-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100'>
            <Menu size={20} />
          </button>
          <h1 className='text-lg font-semibold text-gray-900 sm:text-xl'>
            {title}
          </h1>
        </div>

        {/* Center search (desktop) */}
        <div className='hidden md:block max-w-md w-full mx-4'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search size={16} className='text-gray-400' />
            </div>
            <input
              type='search'
              className='block w-full py-2 pl-10 pr-3 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Iskanje...'
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* Right section with buttons */}
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setIsSearchOpen(true)}
            className='p-2 text-gray-500 rounded-md md:hidden hover:text-gray-900 hover:bg-gray-100'>
            <Search size={20} />
          </button>
          <button className='relative p-2 text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100'>
            <Bell size={20} />
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>
          <div className='w-8 h-8 overflow-hidden rounded-full bg-blue-100'>
            <img
              src='https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
              alt='Profile'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>

      {/* Full-screen search overlay (mobile) */}
      {isSearchOpen && (
        <div className='fixed inset-0 z-50 bg-white p-4 md:hidden'>
          <div className='flex items-center mb-4'>
            <button
              onClick={() => setIsSearchOpen(false)}
              className='p-2 mr-2 text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100'>
              <X size={20} />
            </button>
            <h2 className='text-lg font-medium'>Iskanje</h2>
          </div>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search size={16} className='text-gray-400' />
            </div>
            <input
              type='search'
              className='block w-full py-2 pl-10 pr-3 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Iskanje...'
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          {/* Mobile navigation */}
          <nav className='mt-6'>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='flex items-center p-3 text-gray-600 rounded-md hover:bg-gray-100'>
                  <LayoutDashboard size={18} className='mr-3' />
                  <span>Nadzorna plošča</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center p-3 text-gray-600 rounded-md hover:bg-gray-100'>
                  <Calendar size={18} className='mr-3' />
                  <span>Časovnica</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center p-3 text-gray-600 rounded-md hover:bg-gray-100'>
                  <Users size={18} className='mr-3' />
                  <span>Zaposleni</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center p-3 text-gray-600 rounded-md hover:bg-gray-100'>
                  <Briefcase size={18} className='mr-3' />
                  <span>Projekti</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center p-3 text-gray-600 rounded-md hover:bg-gray-100'>
                  <BarChart3 size={18} className='mr-3' />
                  <span>Poročila</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center p-3 text-gray-600 rounded-md hover:bg-gray-100'>
                  <FileText size={18} className='mr-3' />
                  <span>Zahteve</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
