import React from "react";
import { Calendar, Clock, CheckCircle, XCircle, User } from "lucide-react";
import type { ResourceRequest, Project } from "@/types/types";

interface RequestsTableProps {
  requests: ResourceRequest[];
  projects: Project[];
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  projects,
}) => {
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.project_id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>
            Being reviewed
          </span>
        );
      case "approved":
        return (
          <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
            Approved
          </span>
        );
      case "fulfilled":
        return (
          <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
            Fulfilled
          </span>
        );
      case "rejected":
        return (
          <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
            Rejected
          </span>
        );
      default:
        return (
          <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'>
            {status}
          </span>
        );
    }
  };

  return (
    <div className='bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden'>
      <div className='px-5 py-4 border-b border-gray-100'>
        <h2 className='text-lg font-medium text-gray-900'>Resource Requests</h2>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Request Details
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Project
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Time period
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {sortedRequests.map((request) => (
              <tr
                key={request.id}
                className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center'>
                      <User className='h-5 w-5 text-blue-600' />
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {request.role}
                      </div>
                      {request.skills.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {request.skills.map((skill, index) => (
                            <span
                              key={index}
                              className='px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full'>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {request.notes && (
                        <div className='text-xs text-gray-500 mt-1 max-w-xs'>
                          {request.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {getProjectName(request.projectId)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 flex flex-col space-y-1'>
                    <div className='flex items-center'>
                      <Calendar size={14} className='mr-1 text-gray-400' />
                      <span>
                        {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <Clock size={14} className='mr-1 text-gray-400' />
                      <span>{request.allocation}% utilization</span>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(request.status)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  {request.status === "pending" && (
                    <div className='flex justify-end space-x-2'>
                      <button className='inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                        <CheckCircle size={18} />
                      </button>
                      <button className='inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                  <button className='ml-2 text-blue-600 hover:text-blue-900'>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedRequests.length === 0 && (
        <div className='py-12 text-center text-gray-500'>
          No requests found.
        </div>
      )}
    </div>
  );
};

export default RequestsTable;
