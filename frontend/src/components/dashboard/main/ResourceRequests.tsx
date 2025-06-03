import React from "react";
import { Calendar, Clock } from "lucide-react";
import type { ResourceRequest, Project } from "@/types/types";

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

interface ResourceRequestsProps {
  requests: ResourceRequest[];
  projects: Project[];
}

const ResourceRequests: React.FC<ResourceRequestsProps> = ({
  requests,
  projects,
}) => {
  const pendingRequests = requests
    .filter((req) => req.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("sl-SI", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "fulfilled":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100'>
      <div className='px-5 py-4 border-b border-gray-100'>
        <h2 className='text-lg font-medium text-gray-900'>Resource Requests</h2>
      </div>
      <div className='p-1'>
        {pendingRequests.length > 0 ? (
          <ul className='divide-y divide-gray-100'>
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                className='p-4 hover:bg-gray-50 transition-colors'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <h3 className='font-medium text-gray-900'>
                      {request.role}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {getProjectName(request.projectId)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(
                      request.status
                    )}`}>
                    {request.status === "pending"
                      ? "Being reviewed"
                      : request.status === "approved"
                      ? "Approved"
                      : request.status === "fulfilled"
                      ? "Fulfilled"
                      : "Rejected"}
                  </span>
                </div>
                <div className='flex flex-col space-y-2 text-sm'>
                  <div className='flex items-center text-gray-600'>
                    <Calendar size={14} className='mr-2' />
                    <span>
                      {formatDateRange(request.startDate, request.endDate)}
                    </span>
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <Clock size={14} className='mr-2' />
                    <span>{request.allocation}% utilization</span>
                  </div>
                  {request.skills.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {request.skills.map((skill, index) => (
                        <span
                          key={index}
                          className='px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full'>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className='mt-3 flex space-x-2'>
                  <button className='px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors'>
                    Approve
                  </button>
                  <button className='px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
                    Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className='py-8 px-4 text-center text-gray-500'>
            No pending resource requests.
          </div>
        )}
      </div>
      <div className='px-5 py-3 border-t border-gray-100 text-right'>
        <a
          href={`${apiUrl}/dashboard/requests`}
          className='text-sm font-medium text-blue-600 hover:text-blue-800'>
          Show all requests
        </a>
      </div>
    </div>
  );
};

export default ResourceRequests;
