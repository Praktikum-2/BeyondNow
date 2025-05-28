import React, { useState, useEffect } from "react";
import Button from "@/components/ui/ButtonLanding";
import Container from "@/components/ui/ContainerLanding";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm py-3" : "bg-transparent py-5"
      }`}>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='text-3xl font-semibold tracking-tight text-gray-900'>
              <a href='#'>PlanNow</a>
            </span>
          </div>

          <div className='hidden md:flex items-center space-x-8'>
            <a
              href='#features'
              onClick={(e) => handleSmoothScroll(e, "features")}
              className='text-gray-600 hover:text-gray-900 font-medium transition-colors'>
              Features
            </a>
            <Link to='/login'>
              <Button variant='outline' size='sm'>
                Sign In
              </Button>
            </Link>
            <Link to='/login'>
              <Button variant='primary' size='sm'>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
