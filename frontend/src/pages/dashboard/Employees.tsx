import React, { useState } from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import type { Employee } from "@/types/types";
import { employees as initialEmployees } from "@/data/mockData";
import AddEmployeeForm from "@/components/dashboard/employees/AddEmployeeForm";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const departments = [...new Set(employees.map((emp) => emp.department))];
  const roles = [...new Set(employees.map((emp) => emp.role))];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;
    const matchesRole =
      selectedRole === "all" || employee.role === selectedRole;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleAddEmployee = (formData: any) => {
    const newEmployee: Employee = {
      ...formData,
      availability: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        available: 100,
        projects: [],
      })),
    };

    setEmployees([...employees, newEmployee]);
    setShowAddForm(false);
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
              onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value='all'>Vsi oddelki</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
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

      {/* Employees table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Zaposleni
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Vloga
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Oddelek
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Veščine
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th scope='col' className='relative px-6 py-3'>
                <span className='sr-only'>Uredi</span>
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <img
                        className='h-10 w-10 rounded-full'
                        src={employee.imageUrl}
                        alt=''
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
                  <div className='text-sm text-gray-900'>{employee.role}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {employee.department}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-wrap gap-1'>
                    {employee.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        {skill}
                      </span>
                    ))}
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
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default Employees;
