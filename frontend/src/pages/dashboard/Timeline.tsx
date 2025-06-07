import React, { useEffect, useState } from "react";
import EmployeeTimeline from "@/components/dashboard/timeline/EmployeeTimeline";
import ProjectTimeline from "@/components/dashboard/timeline/ProjectTimeline";
import { projects } from "@/data/mockData";
import type { Employee } from "@/types/types";

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

function setError(message: string) {
  throw new Error("Function not implemented: " + message);
}

const Timeline: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // tu bomo fetchali dejanske podatke employeejev
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${apiUrl}/employees/getAll`);
        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await res.json();

        // Oblikuj podatke, preden shraniš v state
        const formattedEmployees = formatEmployeesForGraph(data);
        setEmployees(formattedEmployees);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchEmployees();
  }, []);

  // oblikujemo pridobljene podatke za graf
  const formatEmployeesForGraph = (employees: any[]): Employee[] => {
    return employees.map((emp) => {
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
        imageUrl: "", // Če še nimaš slike – tu lahko dodaš default ali generiran gravatar
        skills: emp.EmployeeSkill.map((es: any) => es.Skills?.skill).filter(
          Boolean
        ),
        availability,
      };
    });
  };

  return (
    <div className='space-y-6'>
      <EmployeeTimeline />
      <ProjectTimeline projects={projects} employees={employees} />
    </div>
  );
};

export default Timeline;
