import React, { useState } from "react";
import { Plus, Search, Filter, Calendar, Users, Clock } from "lucide-react";
import type { Project } from "@/types/types";
import { projects as initialProjects } from "@/data/mockData";
import AddProjectForm from "@/components/dashboard/projects/AddProjectForm";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("sl-SI", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
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
        return "Načrtovan";
      case "active":
        return "Aktiven";
      case "completed":
        return "Zaključen";
      case "on-hold":
        return "Na čakanju";
      default:
        return status;
    }
  };

  const handleAddProject = (formData: any) => {
    setProjects([...projects, formData]);
    setShowAddForm(false);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900'>Projekti</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Pregled in upravljanje projektov
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
          <Plus size={16} className='mr-2' />
          Nov projekt
        </button>
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
                placeholder='Išči po imenu projekta ali stranki...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <select
              className='block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value='all'>Vsi statusi</option>
              <option value='planned'>Načrtovani</option>
              <option value='active'>Aktivni</option>
              <option value='completed'>Zaključeni</option>
              <option value='on-hold'>Na čakanju</option>
            </select>
            <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <Filter size={16} className='mr-2' />
              Filtri
            </button>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className='bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
            <div className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-medium text-gray-900'>
                    {project.name}
                  </h3>
                  <p className='text-sm text-gray-500'>{project.client}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                    project.status
                  )}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>

              <p className='mt-4 text-sm text-gray-600 line-clamp-2'>
                {project.description}
              </p>

              <div className='mt-6 space-y-3'>
                <div className='flex items-center text-sm text-gray-500'>
                  <Calendar size={16} className='mr-2' />
                  <span>
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate)}
                  </span>
                </div>
                <div className='flex items-center text-sm text-gray-500'>
                  <Users size={16} className='mr-2' />
                  <span>{project.teamMembers.length} članov ekipe</span>
                </div>
                <div className='flex items-center text-sm text-gray-500'>
                  <Clock size={16} className='mr-2' />
                  <span>{project.requiredRoles.length} odprtih pozicij</span>
                </div>
              </div>

              {project.teamMembers.length > 0 && (
                <div className='mt-6'>
                  <div className='flex -space-x-2'>
                    {project.teamMembers.slice(0, 5).map((member, index) => (
                      <div
                        key={index}
                        className='w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200'>
                        <div className='w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs'>
                          {member.employeeId.substring(0, 2)}
                        </div>
                      </div>
                    ))}
                    {project.teamMembers.length > 5 && (
                      <div className='w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium'>
                        +{project.teamMembers.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className='border-t border-gray-200 px-6 py-4'>
              <div className='flex justify-end space-x-3'>
                <button className='text-sm font-medium text-gray-700 hover:text-gray-900'>
                  Podrobnosti
                </button>
                <button className='text-sm font-medium text-blue-600 hover:text-blue-700'>
                  Uredi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddProjectForm
          onSubmit={handleAddProject}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default Projects;
