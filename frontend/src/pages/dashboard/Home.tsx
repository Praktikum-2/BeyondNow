import React from "react";
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
  return (
    <div className='space-y-6'>
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
    </div>
  );
};

export default Dashboard;
