import React from "react";
import { Users, UserPlus, User } from "lucide-react";

interface ProjectEmployee {
  employee_id: string;
  ime: string;
  priimek: string;
  email: string;
  allocation?: number;
  Role: Array<{ employeeRole: string }>;
  Department_Employee_department_id_fkToDepartment?: { name: string };
}

interface ProjectTeamProps {
  projectEmployees: ProjectEmployee[];
  onAddTeamMember?: () => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({
  projectEmployees,
  onAddTeamMember,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-medium text-gray-900'>Current Team</h2>
        <span className='text-sm text-gray-500'>
          {projectEmployees.length} members
        </span>
      </div>

      {projectEmployees.length === 0 ? (
        <div className='text-center text-gray-500 py-8'>
          <Users size={48} className='mx-auto mb-4 text-gray-300' />
          <p>No team members assigned</p>
          <p className='text-sm mt-2'>
            Add employees to this project to see them here
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {projectEmployees.map((employee) => (
            <div
              key={employee.employee_id}
              className='flex items-center space-x-3'>
              <div className='flex-shrink-0 h-10 w-10'>
                <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                  <User size={20} className='text-gray-500' />
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {employee.ime} {employee.priimek}
                </p>
                <p className='text-sm text-gray-500 truncate'>
                  {employee.Role.length > 0
                    ? employee.Role[0].employeeRole
                    : "No Role"}
                  {employee.allocation && ` • ${employee.allocation}%`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='mt-4 pt-4 border-t border-gray-200'>
        <button
          onClick={onAddTeamMember}
          className='w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
          <UserPlus size={16} className='mr-2' />
          Add Team Member
        </button>
      </div>
    </div>
  );
};

export default ProjectTeam;
