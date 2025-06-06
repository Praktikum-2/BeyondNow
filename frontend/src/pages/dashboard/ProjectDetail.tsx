import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  Edit,
  UserPlus,
  Save,
  X,
  User,
} from "lucide-react";
import type { Project } from "@/types/types";

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

interface ProjectEmployee {
  employee_id: string;
  ime: string;
  priimek: string;
  email: string;
  allocation?: number;
  Role: Array<{ employeeRole: string }>;
  Department_Employee_department_id_fkToDepartment?: { name: string };
}

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"details" | "team">("details");
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [projectManager, setProjectManager] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [teamMembersCount, setTeamMembersCount] = useState<number>(0);
  const [projectEmployees, setProjectEmployees] = useState<ProjectEmployee[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/projects/getAll`);
        if (!response.ok) throw new Error("Error fetching projects");

        const projects = await response.json();
        const foundProject = projects.find(
          (p: Project) => p.project_id === projectId
        );

        if (!foundProject) {
          setError("Project not found");
          return;
        }

        setProject(foundProject);

        // Fetch additional data
        await Promise.all([
          fetchProjectManager(foundProject.projectManager_id),
          fetchTeamMembersCount(foundProject.project_id),
          fetchProjectEmployees(foundProject.project_id),
        ]);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const fetchProjectManager = async (managerId: string) => {
    if (!managerId) return;

    try {
      const response = await fetch(
        `${apiUrl}/projects/projectManager/${managerId}`
      );
      if (response.ok) {
        const managerData = await response.json();
        setProjectManager({
          firstName: managerData.ime || "",
          lastName: managerData.priimek || "",
        });
      }
    } catch (err) {
      console.error("Error fetching project manager:", err);
    }
  };

  const fetchTeamMembersCount = async (projectId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/projects/teamMembers/${projectId}`
      );
      if (response.ok) {
        const count = await response.json();
        setTeamMembersCount(typeof count === "number" ? count : 0);
      }
    } catch (err) {
      console.error("Error fetching team members count:", err);
    }
  };

  // New function to fetch project employees with details
  const fetchProjectEmployees = async (projectId: string) => {
    try {
      // To bi moralo returnat employees glede na projekt se treba implementirat na BE
      const response = await fetch(`${apiUrl}/projects/${projectId}/employees`);

      if (response.ok) {
        const employees = await response.json();
        setProjectEmployees(employees);
      } else {
        // Fallback: if the specific endpoint doesn't exist,
        // you might need to get all employees and filter by project
        console.log("Project employees endpoint not available, using fallback");
      }
    } catch (err) {
      console.error("Error fetching project employees:", err);
      // Set empty array on error
      setProjectEmployees([]);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const isoDateString = dateString.replace(" ", "T");
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
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
        return "bg-gray-100 text-gray-800";
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

  // Current Employees Component
  const CurrentEmployees = () => {
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
          <button className='w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
            <UserPlus size={16} className='mr-2' />
            Add Team Member
          </button>
        </div>
      </div>
    );
  };

  const ProjectEditForm = () => {
    const [formData, setFormData] = useState({
      name: project?.name || "",
      description: project?.description || "",
      start_date: project?.start_date || "",
      end_date: project?.end_date || "",
      status: project?.status || "planned",
    });

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/projects/update/${project?.project_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setProject((prev) => (prev ? { ...prev, ...formData } : null));
          setIsEditing(false);
        } else {
          console.error("Failed to update project");
        }
      } catch (err) {
        console.error("Error updating project:", err);
      }
    };

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Project Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Project Description
          </label>
          <textarea
            id='description'
            name='description'
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label
              htmlFor='start_date'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Start Date
            </label>
            <input
              type='date'
              id='start_date'
              name='start_date'
              value={formData.start_date}
              onChange={handleChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div>
            <label
              htmlFor='end_date'
              className='block text-sm font-medium text-gray-700 mb-1'>
              End Date
            </label>
            <input
              type='date'
              id='end_date'
              name='end_date'
              value={formData.end_date}
              onChange={handleChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'>
              <option value='planned'>Planned</option>
              <option value='active'>Active</option>
              <option value='completed'>Completed</option>
              <option value='on-hold'>On Hold</option>
            </select>
          </div>
        </div>

        <div className='flex justify-end space-x-3'>
          <button
            onClick={() => setIsEditing(false)}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
            <X size={16} className='mr-2 inline' />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
            <Save size={16} className='mr-2 inline' />
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const TeamManagement = () => {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-900'>Team Members</h3>
          <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
            <UserPlus size={16} className='mr-2' />
            Add Member
          </button>
        </div>

        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <div className='text-center text-gray-500'>
            <Users size={48} className='mx-auto mb-4 text-gray-300' />
            <p>Team management functionality coming soon...</p>
            <p className='text-sm mt-2'>
              Current team members: {teamMembersCount}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='text-gray-500 mt-2'>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <h2 className='text-xl font-medium text-gray-900 mb-2'>
            Project Not Found
          </h2>
          <p className='text-gray-500 mb-4'>
            {error || "The project with this ID does not exist."}
          </p>
          <button
            onClick={() => navigate("/dashboard/projects")}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
            <ArrowLeft size={16} className='mr-2' />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => navigate("/dashboard/projects")}
            className='p-2 text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100'>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900'>
              {project.name}
            </h1>
            <p className='text-sm text-gray-500'>
              {projectManager
                ? `${projectManager.firstName} ${projectManager.lastName}`
                : "Project Manager not assigned"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
            project.status
          )}`}>
          {getStatusLabel(project.status)}
        </span>
      </div>

      {/* Main Content Grid - Project Info and Current Employees */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Project Info - Takes 2/3 of the space */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-medium text-gray-900'>
                Project Information
              </h2>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='flex items-center'>
                  <Calendar size={20} className='text-gray-400 mr-3' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Timeline
                    </p>
                    <p className='text-sm text-gray-500'>
                      {formatDate(project.start_date)} -{" "}
                      {formatDate(project.end_date)}
                    </p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <Users size={20} className='text-gray-400 mr-3' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Team Size
                    </p>
                    <p className='text-sm text-gray-500'>
                      {teamMembersCount} members
                    </p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <User size={20} className='text-gray-400 mr-3' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Project Manager
                    </p>
                    <p className='text-sm text-gray-500'>
                      {projectManager
                        ? `${projectManager.firstName} ${projectManager.lastName}`
                        : "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-900 mb-2'>
                  Project Description
                </h3>
                <p className='text-sm text-gray-600'>{project.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Employees - Takes 1/3 of the space */}
        <div className='lg:col-span-1'>
          <CurrentEmployees />
        </div>
      </div>

      {/* Tabs Section */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Edit Project
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "team"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Manage Team
            </button>
          </nav>
        </div>

        <div className='p-6'>
          {activeTab === "details" && (
            <div>
              {!isEditing ? (
                <div className='flex justify-between items-center'>
                  <p className='text-gray-600'>
                    Click "Edit" to modify project details.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
                    <Edit size={16} className='mr-2' />
                    Edit Project
                  </button>
                </div>
              ) : (
                <ProjectEditForm />
              )}
            </div>
          )}

          {activeTab === "team" && <TeamManagement />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
