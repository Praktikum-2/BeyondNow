import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import type {
  Project,
  Employee,
  ProjectTimelineRow,
} from "../../../types/types";

const generateDates = (startDate: Date, days: number) => {
  const dates = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < days; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "short",
  }).format(date);
};

const getDayName = (date: Date) => {
  return new Intl.DateTimeFormat("sl-SI", { weekday: "short" }).format(date);
};

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

interface ProjectTimelineProps {
  projects: Project[];
  employees: Employee[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projects,
  employees,
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const daysToShow = 14;
  const dates = generateDates(startDate, daysToShow);

  const navigateDays = (days: number) => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + days);
    setStartDate(newStartDate);
  };

  const generateTimelineRows = (): ProjectTimelineRow[] => {
    return projects.map((project) => {
      const projectEmployees = project.teamMembers.map((member) => {
        const employee = employees.find((e) => e.id === member.employeeId);
        return {
          employeeId: member.employeeId,
          name: employee?.name || "Unknown",
          role: employee?.role || "Unknown",
          allocation: member.allocation,
        };
      });

      const requiredRoles = project.requiredRoles.map((role) => ({
        id: role.id,
        role: role.role,
        startDate: role.startDate,
        endDate: role.endDate,
      }));

      return {
        projectId: project.id,
        projectName: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
        employees: projectEmployees,
        requiredRoles,
      };
    });
  };

  const projectRows = generateTimelineRows();

  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const dateToCheck = date.toISOString().split("T")[0];
    return dateToCheck >= startDate && dateToCheck <= endDate;
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100'>
      <div className='px-5 py-4 border-b border-gray-100 flex items-center justify-between'>
        <h2 className='text-lg font-medium text-gray-900'>
          Časovnica projektov
        </h2>

        <div className='flex items-center space-x-2'>
          {/* Navigation buttons */}
          <div className='flex items-center space-x-1'>
            <button
              onClick={() => navigateDays(-daysToShow)}
              className='p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors'>
              <ChevronLeft size={16} />
            </button>
            <span className='text-sm font-medium text-gray-600'>
              {formatDate(dates[0])} - {formatDate(dates[dates.length - 1])}
            </span>
            <button
              onClick={() => navigateDays(daysToShow)}
              className='p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors'>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[200px]'>
                Projekt
              </th>
              {dates.map((date, index) => (
                <th
                  key={index}
                  className={`px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[40px] ${
                    isWeekend(date) ? "bg-gray-100" : ""
                  }`}>
                  <div className='flex flex-col items-center'>
                    <span className='mb-1'>{getDayName(date)}</span>
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday(date) ? "bg-blue-600 text-white" : ""
                      }`}>
                      {date.getDate()}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {projectRows.map((row) => (
              <React.Fragment key={row.projectId}>
                <tr className='hover:bg-gray-50 transition-colors'>
                  <td className='sticky left-0 z-10 bg-white px-6 py-3 whitespace-nowrap border-r border-gray-200'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {row.projectName}
                      </div>
                      <div className='text-xs text-gray-500 flex items-center'>
                        <Users size={12} className='mr-1' />
                        <span>{row.employees.length} zaposlenih</span>
                      </div>
                    </div>
                  </td>
                  {dates.map((date, dateIndex) => (
                    <td
                      key={dateIndex}
                      className={`border border-gray-100 p-1 h-12 ${
                        isWeekend(date) ? "bg-gray-50" : ""
                      } ${
                        isDateInRange(date, row.startDate, row.endDate)
                          ? "bg-blue-50"
                          : ""
                      }`}>
                      {isDateInRange(date, row.startDate, row.endDate) && (
                        <div className='w-full h-full flex items-center justify-center'>
                          <div className='w-4 h-4 bg-blue-500 rounded-sm'></div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Resource requests for this project */}
                {row.requiredRoles.map((role) => (
                  <tr
                    key={role.id}
                    className='bg-gray-50 hover:bg-gray-100 transition-colors'>
                    <td className='sticky left-0 z-10 bg-gray-50 hover:bg-gray-100 px-6 py-2 whitespace-nowrap border-r border-gray-200 pl-10'>
                      <div className='text-xs font-medium text-gray-500 flex items-center'>
                        <Plus size={12} className='mr-1' />
                        <span>{role.role} potreben</span>
                      </div>
                    </td>
                    {dates.map((date, dateIndex) => (
                      <td
                        key={dateIndex}
                        className={`border border-gray-100 p-1 h-8 ${
                          isWeekend(date) ? "bg-gray-100" : ""
                        } ${
                          isDateInRange(date, role.startDate, role.endDate)
                            ? "bg-yellow-50"
                            : ""
                        }`}>
                        {isDateInRange(date, role.startDate, role.endDate) && (
                          <div className='w-full h-full flex items-center justify-center'>
                            <div className='w-3 h-3 bg-yellow-400 rounded-sm'></div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTimeline;
