import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split("/")[2] || "";

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activePage={path}
        onNavigate={(page) => navigate(`/dashboard/${page}`)}
      />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Header
          title={title}
          onToggleSidebar={() => setIsMobileMenuOpen(true)}
        />
        <main className='flex-1 overflow-auto p-4 sm:p-6'>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
