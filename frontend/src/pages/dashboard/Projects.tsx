import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/types/types";
import AddProjectForm from "@/components/dashboard/projects/AddProjectForm";
import { FaUserTie } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembersCounts, setTeamMembersCounts] = useState<
    Record<string, number>
  >({});
  const [projectManagers, setProjectManagers] = useState<
    Record<string, { firstName: string; lastName: string }>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/projects/getAll`);
      if (!response.ok) throw new Error("Error fetching projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const counts: Record<string, number> = {};
      const managers: Record<string, { firstName: string; lastName: string }> =
        {};

      await Promise.all(
        projects.map(async (project) => {
          try {
            const resCount = await fetch(
              `${apiUrl}/projects/teamMembers/${project.project_id}`
            );
            const dataCount = await resCount.json();
            counts[project.project_id] =
              typeof dataCount === "number" ? dataCount : 0;
          } catch (err) {
            console.error(
              `Error fetching team members for project ${project.project_id}:`,
              err
            );
            counts[project.project_id] = 0;
          }

          if (project.projectManager_id) {
            try {
              const resManager = await fetch(
                `${apiUrl}/projects/projectManager/${project.projectManager_id}`
              );
              if (!resManager.ok) throw new Error("Manager not found");
              const managerData = await resManager.json();
              managers[project.project_id] = {
                firstName: managerData.ime || "",
                lastName: managerData.priimek || "",
              };
            } catch (err) {
              console.error(
                `Error fetching manager for project ${project.project_id}:`,
                err
              );
              managers[project.project_id] = {
                firstName: "Not assigned",
                lastName: "",
              };
            }
          } else {
            managers[project.project_id] = {
              firstName: "Not assigned",
              lastName: "",
            };
          }
        })
      );

      setTeamMembersCounts(counts);
      setProjectManagers(managers);
    };

    if (projects.length > 0) {
      fetchData();
    }
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const isoDateString = dateString.replace(" ", "T");
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
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
        return "On Hold";
      default:
        return status;
    }
  };

  const handleAddProject = (formData: Project) => {
    setProjects([...projects, formData]);
    setShowAddForm(false);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900'>Projects</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Overview and managing projects
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
          <Plus size={16} className='mr-2' />
          New project
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
                placeholder='Search by project name...'
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
              <option value='all'>All statuses</option>
              <option value='planned'>Planned</option>
              <option value='active'>Active</option>
              <option value='completed'>Completed</option>
              <option value='on-hold'>On Hold</option>
            </select>
            <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <Filter size={16} className='mr-2' />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading Spinner or Project Cards */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProjects.map((project) => (
            <Link
              key={project.project_id}
              to={`/dashboard/projects/${project.project_id}`}
              className='bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer block'>
              <div className='p-6'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {project.name}
                    </h3>
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
                      {formatDate(project.start_date)} –{" "}
                      {formatDate(project.end_date)}
                    </span>
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <FaUserTie size={16} className='mr-2' />
                    <span>
                      {projectManagers[project.project_id]
                        ? `${projectManagers[project.project_id].firstName} ${
                            projectManagers[project.project_id].lastName
                          }`
                        : "Loading..."}
                    </span>
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <Users size={16} className='mr-2' />
                    <span>
                      {project.project_id in teamMembersCounts
                        ? `${
                            teamMembersCounts[project.project_id]
                          } team members`
                        : "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

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
