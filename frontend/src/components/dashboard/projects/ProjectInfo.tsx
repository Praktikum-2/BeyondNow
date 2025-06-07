import React from "react";
import { Calendar, Users, User } from "lucide-react";
import type { Project } from "@/types/types";

interface ProjectInfoProps {
  project: Project;
  projectManager: {
    firstName: string;
    lastName: string;
  } | null;
  teamMembersCount: number;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  project,
  projectManager,
  teamMembersCount,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const isoDateString = dateString.replace(" ", "T");
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='px-6 py-4 border-b border-gray-200'>
        <h2 className='text-lg font-medium text-gray-900'>
          Project Information
        </h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='flex items-center'>
            <Calendar size={20} className='text-gray-400 mr-3' />
            <div>
              <p className='text-sm font-medium text-gray-900'>Timeline</p>
              <p className='text-sm text-gray-500'>
                {formatDate(project.start_date)} -{" "}
                {formatDate(project.end_date)}
              </p>
            </div>
          </div>
          <div className='flex items-center'>
            <Users size={20} className='text-gray-400 mr-3' />
            <div>
              <p className='text-sm font-medium text-gray-900'>Team Size</p>
              <p className='text-sm text-gray-500'>
                {teamMembersCount} members
              </p>
            </div>
          </div>
          <div className='flex items-center'>
            <User size={20} className='text-gray-400 mr-3' />
            <div>
              <p className='text-sm font-medium text-gray-900'>
                Project Manager
              </p>
              <p className='text-sm text-gray-500'>
                {projectManager
                  ? `${projectManager.firstName} ${projectManager.lastName}`
                  : "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className='text-sm font-medium text-gray-900 mb-2'>
            Project Description
          </h3>
          <p className='text-sm text-gray-600'>{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
