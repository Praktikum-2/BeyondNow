import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, UserPlus, Users } from "lucide-react";
import type { Project } from "@/types/types";
import ProjectInfo from "@/components/dashboard/projects/ProjectInfo";
import ProjectTeam from "@/components/dashboard/projects/ProjectTeam";
import ProjectEditForm from "@/components/dashboard/projects/ProjectEditForm";

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

  const fetchProjectEmployees = async (projectId: string) => {
    try {
      const response = await fetch(`${apiUrl}/projects/${projectId}/employees`);

      if (response.ok) {
        const employees = await response.json();
        setProjectEmployees(employees);
      } else {
        console.log("Project employees endpoint not available, using fallback");
      }
    } catch (err) {
      console.error("Error fetching project employees:", err);
      setProjectEmployees([]);
    }
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

  const handleSaveProject = async (updatedProject: Partial<Project>) => {
    setProject((prev) => (prev ? { ...prev, ...updatedProject } : null));
    setIsEditing(false);
  };

  const handleAddTeamMember = () => {
    // TODO: Implement add team member functionality
    console.log("Add team member clicked");
  };

  const TeamManagement = () => {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-900'>Team Members</h3>
          <button
            onClick={handleAddTeamMember}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
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
          <ProjectInfo
            project={project}
            projectManager={projectManager}
            teamMembersCount={teamMembersCount}
          />
        </div>

        {/* Current Employees - Takes 1/3 of the space */}
        <div className='lg:col-span-1'>
          <ProjectTeam
            projectEmployees={projectEmployees}
            onAddTeamMember={handleAddTeamMember}
          />
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
                <ProjectEditForm
                  project={project}
                  onSave={handleSaveProject}
                  onCancel={() => setIsEditing(false)}
                  apiUrl={apiUrl}
                />
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
