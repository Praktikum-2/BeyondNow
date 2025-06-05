import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  X,
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";

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
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        document.body.getBoundingClientRect();
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible && isMounted) {
      const timeout = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isMounted]);

  if (!isMounted) return null;

  const handleNavigation = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const mainNavItems = [
    {
      id: "",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { id: "timeline", label: "Timeline", icon: <Calendar size={18} /> },
    { id: "employees", label: "Employees", icon: <Users size={18} /> },
    { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
    { id: "departments", label: "Departments", icon: <Building2 size={18} /> },
    { id: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
    { id: "requests", label: "Requests", icon: <FileText size={18} /> },
  ];

  const otherNavItems = [
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    { id: "help", label: "Help", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className='fixed inset-0 z-40 flex lg:hidden'>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-600/60 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}></div>

      {/* Sliding panel */}
      <div
        className={`relative flex flex-col w-72 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h1 className='text-lg font-semibold text-gray-900'>
            Employee Planning
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
          <button
            onClick={handleLogout}
            className='flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200 group'>
            <LogOut
              size={18}
              className='group-hover:scale-110 transition-transform duration-200'
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
