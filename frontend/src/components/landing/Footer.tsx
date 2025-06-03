import React from "react";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";
import Container from "@/components/ui/ContainerLanding";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-50 pt-16 pb-12'>
      <Container>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
          <div className='col-span-1 md:col-span-1'>
            <div className='mb-5'>
              <span className='text-xl font-medium text-gray-900'>PlanNow</span>
            </div>
            <p className='text-gray-600 mb-4 max-w-xs'>
              Empowering teams to plan smarter, allocate better, and deliver
              projects with confidence.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-gray-800 transition-colors'
                aria-label='Twitter'>
                <Twitter size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-gray-800 transition-colors'
                aria-label='Instagram'>
                <Instagram size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-gray-800 transition-colors'
                aria-label='LinkedIn'>
                <Linkedin size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-gray-800 transition-colors'
                aria-label='GitHub'>
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className='font-medium text-gray-900 mb-4'>Product</h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Features
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Integrations
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-medium text-gray-900 mb-4'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  About
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Blog
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-medium text-gray-900 mb-4'>Resources</h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Support
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-600 hover:text-gray-900 transition-colors'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='pt-8 border-t border-gray-200'>
          <p className='text-gray-600 text-sm text-center'>
            © {currentYear} Praktikum Ekipa. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
