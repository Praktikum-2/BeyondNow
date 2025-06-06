import {
  BarChart3,
  Briefcase,
  Calendar,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Building2,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          active
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}>
        <span className='flex-shrink-0'>{icon}</span>
        <span className='truncate'>{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2] || "";
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
    <aside className='hidden lg:flex flex-col w-56 h-screen border-r border-gray-200 bg-white'>
      <div className='p-4 border-b border-gray-200'>
        <h1 className='text-lg font-semibold text-gray-900'>
          Employee Planning
        </h1>
      </div>
      <nav className='flex-1 overflow-y-auto py-4 px-3'>
        <ul className='space-y-1'>
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              to={`/dashboard${item.id ? `/${item.id}` : ""}`}
              active={currentPath === item.id}
            />
          ))}
        </ul>
        <div className='pt-4 mt-4 border-t border-gray-200'>
          <ul className='space-y-1'>
            {otherNavItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                to={`/dashboard/${item.id}`}
                active={currentPath === item.id}
              />
            ))}
          </ul>
        </div>
      </nav>
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
    </aside>
  );
};

export default Sidebar;
