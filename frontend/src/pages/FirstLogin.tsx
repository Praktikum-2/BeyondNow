import React from "react";
//import { useNavigate } from "react-router-dom";
import DashboardSkeleton from "@/components/first-login/DashboardSkeleton"; // Adjust path if needed
import { Input } from "@/components/ui/input";

const FirstLogin: React.FC = () => {
  //const navigate = useNavigate();

  const handleCreateOrganization = () => {
    //navigate("/create-organization");
  };

  const handleJoinOrganization = () => {
    //navigate("/join-organization");
  };

  return (
    <div className='relative min-h-screen bg-gray-100 overflow-hidden'>
      {/* Skeleton background */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <div className='h-full w-full scale-95 blur-sm opacity-100 pointer-events-none'>
          <DashboardSkeleton />
        </div>
      </div>
      <div className='bg-gray-100/20'>
        {/* Login overlay */}
        <div className='relative z-10 flex items-center justify-center min-h-screen px-4'>
          <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
              Welcome
            </h1>
            <p className='text-gray-600 mb-6'>
              Get started by creating a new organization or joining an existing
              one.
            </p>
            <Input
              id='organization-name'
              type='text'
              placeholder='Name of your Ogranization'
              required
            />
            <div className='flex flex-col mt-4 space-y-4'>
              <button
                onClick={handleCreateOrganization}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'>
                Create Organization
              </button>
              <button
                onClick={handleJoinOrganization}
                className='w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition'>
                Join Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstLogin;
