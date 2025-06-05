import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in a dashboard context
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const handleHomePage = () => {
    if (isDashboardRoute) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className={`${
        isDashboardRoute ? "h-full" : "min-h-screen"
      } bg-gray-50 flex flex-col items-center justify-center px-4 overflow-hidden`}>
      <div className='text-center max-w-md'>
        {/* 404 Icon */}
        <div className='flex justify-center mb-6'>
          <AlertCircle size={80} className='text-blue-600' />
        </div>

        <h1 className='text-6xl md:text-8xl font-bold text-blue-600 mb-4'>
          404
        </h1>
        <h2 className='text-xl md:text-2xl font-semibold text-gray-900 mb-2'>
          Page Not Found
        </h2>
        <p className='text-gray-500 mb-6 text-sm md:text-base'>
          The page "{location.pathname}" doesn't exist or has been moved.
        </p>

        <div className='space-y-3'>
          <button
            onClick={handleHomePage}
            className='inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 w-full justify-center transition-colors duration-200'>
            <Home size={16} className='mr-2' />
            {isDashboardRoute ? "Back to Dashboard" : "Back to Home"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full justify-center transition-colors duration-200'>
            <ArrowLeft size={16} className='mr-2' />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
