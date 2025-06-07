import React, { useState } from "react";
import { Save, X } from "lucide-react";
import type { Project } from "@/types/types";

interface ProjectEditFormProps {
  project: Project;
  onSave: (updatedProject: Partial<Project>) => Promise<void>;
  onCancel: () => void;
  apiUrl: string;
}

const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  project,
  onSave,
  onCancel,
  apiUrl,
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    status: project?.status || "planned",
  });

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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
        await onSave(formData);
      } else {
        console.error("Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
          disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            disabled={isLoading}>
            <option value='planned'>Planned</option>
            <option value='active'>Active</option>
            <option value='completed'>Completed</option>
            <option value='on-hold'>On Hold</option>
          </select>
        </div>
      </div>

      <div className='flex justify-end space-x-3'>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'>
          <X size={16} className='mr-2 inline' />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50'>
          <Save size={16} className='mr-2 inline' />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProjectEditForm;
