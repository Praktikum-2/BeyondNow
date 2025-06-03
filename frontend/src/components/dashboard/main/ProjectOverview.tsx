import React from "react";
import { Link } from "react-router-dom";
import type { Project } from "@/types/types";

interface ProjectOverviewProps {
  projects: Project[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projects }) => {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const calculateProgress = (project: Project) => {
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const today = new Date().getTime();

    if (today <= start) return 0;
    if (today >= end) return 100;

    const totalDuration = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / totalDuration) * 100);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on-hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planned":
        return "Planned";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "on-hold":
        return "On-hold";
      default:
        return status;
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100'>
      <div className='px-5 py-4 border-b border-gray-100'>
        <h2 className='text-lg font-medium text-gray-900'>Projects</h2>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Project
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Time period
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Progress
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Team
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {sortedProjects.map((project) => (
              <tr
                key={project.id}
                className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {project.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {project.client}
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                      project.status
                    )}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-blue-600 rounded-full'
                      style={{ width: `${calculateProgress(project)}%` }}></div>
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    {calculateProgress(project)}% končano
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex -space-x-2'>
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className='w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200'
                        title={`Team member ${index + 1}`}>
                        {/* Here we would use actual employee images */}
                        <div className='w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs'>
                          {member.employeeId.substring(0, 2)}
                        </div>
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className='w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium'>
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='px-5 py-3 border-t border-gray-100 text-right'>
        <Link
          to='/dashboard/projects'
          className='text-sm font-medium text-blue-600 hover:text-blue-800'>
          Show all projects
        </Link>
      </div>
    </div>
  );
};

export default ProjectOverview;
