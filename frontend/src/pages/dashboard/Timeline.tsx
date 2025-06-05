import React from "react";
import EmployeeTimeline from "@/components/dashboard/timeline/EmployeeTimeline";
import ProjectTimeline from "@/components/dashboard/timeline/ProjectTimeline";
import { employees, projects } from "@/data/mockData";

// tu bomo fetchali dejanske podatke employeejev
//const employees = [{}];

const Timeline: React.FC = () => {
  return (
    <div className='space-y-6'>
      <EmployeeTimeline employees={employees} />
      <ProjectTimeline projects={projects} employees={employees} />
    </div>
  );
};

export default Timeline;
