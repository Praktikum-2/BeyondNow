import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import type { Employee, TimelineRow } from "@/types/types";
import InitialsAvatar from "./InitialsAvatar";
import EmployeeTimelineFilter from "./EmployeeTimelineFilter";

// generiramo datume za prikaz v grafu
const generateDates = (startDate: Date, days: number) => {
  const dates = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < days; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// datum spremenimo v ustrezno obliko
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(date);
};

//pridobimo ime dneva
const getDayName = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
};

// preverimo ali je dan vikend
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

//preveri ali je danasnji datum enak podanemu
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

function setError(message: string) {
  throw new Error("Function not implemented: " + message);
}

interface Filters {
  department: string;
  skills: string[];
}

const EmployeeTimeline: React.FC = () => {
  // zaposleni v grafu
  const [employeesGraph, setEmployeesGraph] = useState<Employee[]>([]);

  //za shranjevanje filtrov --> rabo se bo za posodobljene prikaze
  const [filters, setFilters] = useState<Filters>();

  // tu bomo fetchali dejanske podatke employeejev
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let res: Response;

        if (
          (filters?.department === "" || !filters?.department) &&
          (!filters?.skills || filters.skills.length === 0)
        ) {
          res = await fetch(`${apiUrl}/employees/getAll`);
        } else if (
          filters?.department &&
          filters.department !== "" &&
          (!filters?.skills || filters.skills.length === 0)
        ) {
          res = await fetch(
            `${apiUrl}/employees/getGraph/${filters.department}`
          );
        } else if (
          (!filters?.department || filters.department === "") &&
          filters?.skills &&
          filters.skills.length > 0
        ) {
          // Če je skills array, ga je treba pravilno podati v URL (join z vejicami)
          const skills_id = encodeURIComponent(filters.skills.join(","));
          console.log(`${apiUrl}/employees/getGraph/skills/${skills_id}`);
          res = await fetch(`${apiUrl}/employees/getGraph/skills/${skills_id}`);
        } else {
          const skillsParam = encodeURIComponent(
            filters?.skills?.join(",") ?? ""
          );
          res = await fetch(
            `${apiUrl}/employees/getGraph/${filters.department}/${skillsParam}`
          );
        }

        if (!res.ok) {
          throw new Error("Failed to fetch employees" + res.statusText);
        }
        const data = await res.json();
        const formatted = formatEmployeesForGraph(data);
        setEmployeesGraph(formatted);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchEmployees();
  }, [filters]);

  // pridobimo podatke zaposlenih
  // oblikujemo pridobljene podatke za graf
  const formatEmployeesForGraph = (employeesGraph: any[]): Employee[] => {
    return employeesGraph.map((emp) => {
      const availability = emp.Role.map((role: any) => ({
        project: role.Project?.name ?? "Unknown Project",
        role: role.employeeRole,
        allocation: role.allocation ?? 0,
        startDate: role.startDate ?? null,
        endDate: role.endDate ?? null,
      }));

      return {
        id: emp.employee_id,
        name: `${emp.ime} ${emp.priimek}`,
        email: emp.email ?? "",
        role: availability[0]?.role ?? "", // Glavna vloga – prvi zapis v `Role`, če obstaja
        department:
          emp.Department_Employee_department_id_fkToDepartment?.name ?? "",
        imageUrl: "", // Če še nimaš slike – tu lahko dodaš default ali generiran avatar
        skills: emp.EmployeeSkill.map((es: any) => es.Skills?.skill).filter(
          Boolean
        ),
        availability,
      };
    });
  };

  //za prikaz filtra
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const daysToShow = 14;
  const dates = generateDates(startDate, daysToShow);

  // premaknemo datume v grafu
  const navigateDays = (days: number) => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + days);
    setStartDate(newStartDate);
  };

  const generateTimelineRows = (): TimelineRow[] => {
    return employeesGraph.map((employee) => {
      const cells = dates.map((date) => {
        const dateString = date.toISOString().split("T")[0];
        const availabilityRecord = employee.availability.find(
          (a) => a.date === dateString
        );

        let status:
          | "available"
          | "partially-booked"
          | "almost-fully-booked"
          | "overbooked" = "available";
        let allocation = 0;
        let projects: { projectId: string; allocation: number }[] = [];

        if (availabilityRecord) {
          allocation = 100 - availabilityRecord.available;
          projects = availabilityRecord.projects;

          // Status na osnovi allocation vrednosti
          if (allocation >= 100) {
            status = "overbooked";
          } else if (allocation >= 80) {
            status = "almost-fully-booked";
          } else if (allocation >= 30) {
            status = "partially-booked";
          } else {
            status = "available";
          }
        }

        return {
          date: dateString,
          status,
          allocation,
          projects,
        };
      });

      return {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        cells,
      };
    });
  };

  const timelineRows = generateTimelineRows();

  const getCellColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-red-600 border-red-700";
      case "partially-booked":
        return "bg-yellow-300 border-yellow-400";
      case "almost-fully-booked":
        return "bg-green-800 border-green-900";
      case "overbooked":
        return "bg-purple-800 border-purple-900";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  const StatusIndicator = ({ status }: { status: string }) => {
    let bgColor = "";
    let text = "";

    switch (status) {
      case "available":
        bgColor = "bg-green-500";
        text = "Available";
        break;
      case "partially-booked":
        bgColor = "bg-yellow-500";
        text = "Partially-booked";
        break;
      case "fully-booked":
        bgColor = "bg-blue-500";
        text = "Fully-booked";
        break;
      case "overbooked":
        bgColor = "bg-red-500";
        text = "Overbooked";
        break;
      default:
        bgColor = "bg-gray-500";
        text = "Unknown";
    }

    return (
      <div className='flex items-center'>
        <div className={`w-3 h-3 rounded-full ${bgColor} mr-1`}></div>
        <span>{text}</span>
      </div>
    );
  };

  // kako obdelamo filtre
  const handleAddFilter = async (formData: any) => {
    setFilters(formData);

    setShowFilter(false);
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100'>
      <div className='px-5 py-4 border-b border-gray-100 flex items-center justify-between'>
        <h2 className='text-lg font-medium text-gray-900'>Employee timeline</h2>

        <div className='flex items-center space-x-2'>
          {/* drugacni pogledi na grafu*/}
          <button className='p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors'>
            Weekly
          </button>
          <button className='p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors'>
            Monthly
          </button>
          <button className='p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors mr-10'>
            Quarterly
          </button>

          {/* Filter button */}
          <button
            onClick={() => setShowFilter(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
            <Filter size={16} className='mr-2' />
            Filter
          </button>

          {showFilter && (
            <EmployeeTimelineFilter
              onSubmit={handleAddFilter}
              onClose={() => setShowFilter(false)}
            />
          )}

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

      {/* Legend */}
      <div className='px-5 py-2 border-b border-gray-100 flex flex-wrap items-center text-xs text-gray-600'>
        <div className='mr-4'>Legend:</div>
        <div className='flex space-x-4'>
          <StatusIndicator status='available' />
          <StatusIndicator status='partially-booked' />
          <StatusIndicator status='fully-booked' />
          <StatusIndicator status='overbooked' />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[200px]'>
                Employees
              </th>
              {dates.map((date, index) => (
                <th
                  key={index}
                  className={`px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[40px] ${
                    isWeekend(date) ? "bg-gray-200" : ""
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
            {timelineRows.map((row) => (
              <tr key={row.id} className='hover:bg-gray-50 transition-colors'>
                <td className='sticky left-0 z-10 bg-white px-6 py-3 whitespace-nowrap border-r border-gray-200'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-200'>
                      {employeesGraph.find((e) => e.id === row.id)?.imageUrl ? (
                        <img
                          src={
                            employeesGraph.find((e) => e.id === row.id)
                              ?.imageUrl || ""
                          }
                          alt={row.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <InitialsAvatar name={row.name} size={32} />
                      )}
                    </div>
                    <div className='ml-3'>
                      <div className='text-sm font-medium text-gray-900'>
                        {row.name}
                      </div>
                      <div className='text-xs text-gray-500'>{row.role}</div>
                    </div>
                  </div>
                </td>
                {/* podatki v grafu */}
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-gray-100 p-0 h-14 relative ${
                      isWeekend(dates[cellIndex]) ? "bg-gray-300" : ""
                    }`}>
                    <div
                      className={`w-full h-full ${
                        isWeekend(dates[cellIndex])
                          ? "bg-gray-300"
                          : getCellColor(cell.status)
                      } transition-colors cursor-pointer`}
                      title={
                        isWeekend(dates[cellIndex])
                          ? "weekend"
                          : `${row.name}: ${cell.status} (${cell.allocation}% allocated)`
                      }>
                      {/* Polnilo ozadja na osnovi allocation */}
                      {cell.allocation > 0 && (
                        <div
                          className={`absolute bottom-0 left-0 right-0 opacity-60 ${
                            isWeekend(new Date(cell.date))
                              ? "bg-gray-300"
                              : cell.allocation >= 100
                              ? "bg-blue-500"
                              : cell.allocation >= 80
                              ? "bg-green-600"
                              : cell.allocation >= 30
                              ? "bg-yellow-200"
                              : "bg-red-400"
                          }`}
                          style={{
                            height: `${Math.min(cell.allocation, 100)}%`,
                          }}></div>
                      )}

                      {/* Tekst v sredini */}
                      <div className='absolute inset-0 flex items-center justify-center z-10 text-white drop-shadow-sm'>
                        {isWeekend(new Date(cell.date))
                          ? ""
                          : cell.allocation > 0
                          ? `${cell.allocation}%`
                          : ""}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTimeline;
