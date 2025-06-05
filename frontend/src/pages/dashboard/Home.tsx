import React from "react";
import { useAuth } from "@/contexts/authContext";
import DashboardMetrics from "@/components/dashboard/main/DashboardMetrics";
import UtilizationChart from "@/components/dashboard/main/UtilizationChart";
import ProjectOverview from "@/components/dashboard/main/ProjectOverview";
import ResourceRequests from "@/components/dashboard/main/ResourceRequests";
import DepartmentUtilizationChart from "@/components/dashboard/main/DepartmentUtilizationChart";
import {
  dashboardMetrics,
  utilizationData,
  projects,
  resourceRequests,
  departmentUtilization,
} from "../../data/mockData";

const Dashboard: React.FC = () => {
  const { userData, currentUser } = useAuth();

  return (
    <div className='space-y-6'>
      {/* Welcome header with user info */}
      <div className='bg-white rounded-lg shadow p-6 border'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Welcome back,{" "}
              {userData?.name || currentUser?.displayName || "User"}!
            </h1>
            <div className='space-y-1 text-sm text-gray-600'>
              <p>
                <span className='font-medium'>Organization:</span>{" "}
                {userData?.organization?.name || "Not set"}
              </p>
              <p>
                <span className='font-medium'>Email:</span>{" "}
                {userData?.email || currentUser?.email}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='text-right text-sm text-gray-500'>
              <p>
                Last login via{" "}
                {currentUser?.providerData[0]?.providerId || "email"}
              </p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics overview */}
      <DashboardMetrics metrics={dashboardMetrics} />

      {/* Main dashboard content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left column */}
        <div className='lg:col-span-2 space-y-6'>
          <UtilizationChart data={utilizationData} />
          <ProjectOverview projects={projects} />
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          <ResourceRequests requests={resourceRequests} projects={projects} />
          <DepartmentUtilizationChart data={departmentUtilization} />
        </div>
      </div>

      {/* Quick user info card for development/debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
          <h3 className='font-semibold text-gray-700 mb-2'>Debug Info</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <h4 className='font-medium text-gray-600'>Firebase User:</h4>
              <ul className='text-gray-500 space-y-1'>
                <li>UID: {currentUser?.uid}</li>
                <li>Email: {currentUser?.email}</li>
                <li>
                  Email Verified: {currentUser?.emailVerified ? "Yes" : "No"}
                </li>
                <li>Provider: {currentUser?.providerData[0]?.providerId}</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium text-gray-600'>Backend User Data:</h4>
              <ul className='text-gray-500 space-y-1'>
                <li>Name: {userData?.name}</li>
                <li>Email: {userData?.email}</li>
                <li>
                  Has Organization: {userData?.hasOrganization ? "Yes" : "No"}
                </li>
                <li>Organization: {userData?.organization?.name || "None"}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
