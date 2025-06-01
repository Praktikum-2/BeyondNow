import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import type { Employee, Department, DbEmployee } from "@/types/types";
import AddEmployeeForm from "@/components/dashboard/employees/AddEmployeeForm";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform database employee to frontend employee format
  const transformEmployee = (dbEmp: DbEmployee): Employee => ({
    id: dbEmp.employee_id,
    name: `${dbEmp.ime}${dbEmp.priimek ? ` ${dbEmp.priimek}` : ""}`,
    email: dbEmp.email || "",
    role:
      dbEmp.Role.length > 0
        ? dbEmp.Role[0].employeeRole || "No Role"
        : "No Role",
    department:
      dbEmp.Department_Employee_department_id_fkToDepartment?.name ||
      "No Department",
    imageUrl: "/default.jpg", // Fixed path
    skills: dbEmp.EmployeeSkill.map((es) => es.Skills?.skill).filter(
      (skill): skill is string => skill !== null && skill !== undefined
    ),
    availability: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      available: 100,
      projects: [],
    })),
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/departments/getAll"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const departmentsData: Department[] = await response.json();
        setDepartments(departmentsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching departments"
        );
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch employees from database
  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await fetch("http://localhost:3000/employees/getAll");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const dbEmployees: DbEmployee[] = await response.json();
      const transformedEmployees = dbEmployees.map(transformEmployee);
      setEmployees(transformedEmployees);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching employees");
      console.error("Error fetching employees:", err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const roles = [...new Set(employees.map((emp) => emp.role))];

  // Filtered employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;
    const matchesRole =
      selectedRole === "all" || employee.role === selectedRole;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Handle adding new employee
  const handleAddEmployee = async (formData: any) => {
    try {
      const response = await fetch("http://localhost:3000/employees/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create employee: ${response.statusText}`);
      }

      // Refresh the employees list
      await fetchEmployees();
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding employee");
      console.error("Error adding employee:", err);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900'>Zaposleni</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Upravljanje zaposlenih in njihovih veščin
          </p>
        </div>
        <div className='flex space-x-3'>
          <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
            <Download size={16} className='mr-2' />
            Izvozi
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
            <Plus size={16} className='mr-2' />
            Dodaj zaposlenega
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <div className='text-sm text-red-700'>Error: {error}</div>
        </div>
      )}

      {/* Search and filters */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search size={16} className='text-gray-400' />
              </div>
              <input
                type='text'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                placeholder='Išči po imenu ali e-pošti...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <select
              className='block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={loading}>
              <option value='all'>
                {loading ? "Nalaganje..." : "Vsi oddelki"}
              </option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <select
              className='block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}>
              <option value='all'>Vse vloge</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <Filter size={16} className='mr-2' />
              Filtri
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {employeesLoading && (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
          <div className='text-sm text-gray-500'>Nalaganje zaposlenih...</div>
        </div>
      )}

      {/* Employees table */}
      {!employeesLoading && (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Zaposleni
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Vloga
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Oddelek
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Veščine
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='relative px-6 py-3'>
                  <span className='sr-only'>Uredi</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-sm text-gray-500'>
                    {employees.length === 0
                      ? "Ni zaposlenih"
                      : "Ni ujemajočih se zaposlenih"}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <img
                            className='h-10 w-10 rounded-full'
                            src={employee.imageUrl}
                            alt=''
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%236b7280' font-size='12'%3E👤%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {employee.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {employee.role}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {employee.department}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-wrap gap-1'>
                        {employee.skills?.length > 0 ? (
                          employee.skills.map((skill, index) => (
                            <span
                              key={index}
                              className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className='text-sm text-gray-400'>
                            Ni veščin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                        Aktiven
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button className='text-blue-600 hover:text-blue-900'>
                        Uredi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setShowAddForm(false)}
          departments={departments}
        />
      )}
    </div>
  );
};

export default Employees;
