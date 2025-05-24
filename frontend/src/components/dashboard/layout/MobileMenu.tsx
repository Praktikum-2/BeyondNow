import React from "react";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activePage,
  onNavigate,
}) => {
  const handleNavigation = (page: string) => {
    onNavigate(page);
    onClose();
  };

  if (!isOpen) return null;

  const mainNavItems = [
    {
      id: "dashboard",
      label: "Nadzorna plošča",
      icon: <LayoutDashboard size={18} />,
    },
    { id: "timeline", label: "Časovnica", icon: <Calendar size={18} /> },
    { id: "employees", label: "Zaposleni", icon: <Users size={18} /> },
    { id: "projects", label: "Projekti", icon: <Briefcase size={18} /> },
    { id: "reports", label: "Poročila", icon: <BarChart3 size={18} /> },
    { id: "requests", label: "Zahteve", icon: <FileText size={18} /> },
  ];

  const otherNavItems = [
    { id: "settings", label: "Nastavitve", icon: <Settings size={18} /> },
    { id: "help", label: "Pomoč", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className='fixed inset-0 z-40 flex lg:hidden'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-gray-600 bg-opacity-75'
        onClick={onClose}></div>

      {/* Menu panel */}
      <div className='relative flex flex-col w-72 max-w-xs bg-white'>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h1 className='text-lg font-semibold text-gray-900'>
            Planiranje zaposlenih
          </h1>
          <button
            onClick={onClose}
            className='p-2 text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100'>
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto py-4 px-3'>
          <ul className='space-y-1'>
            {mainNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activePage === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  <span className='flex-shrink-0'>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className='pt-4 mt-4 border-t border-gray-200'>
            <ul className='space-y-1'>
              {otherNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activePage === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    <span className='flex-shrink-0'>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='p-3 border-t border-gray-200'>
          <button className='flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors'>
            <LogOut size={18} />
            <span>Odjava</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
