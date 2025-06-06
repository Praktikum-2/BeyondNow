import React, { useState } from "react";
import { X } from "lucide-react";
import type { ProjectMock } from "@/types/types";

interface ResourceRequestFormProps {
  projects: ProjectMock[];
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const ResourceRequestForm: React.FC<ResourceRequestFormProps> = ({
  projects,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    projectId: "",
    role: "",
    skills: "",
    startDate: "",
    endDate: "",
    allocation: 100,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    onSubmit({
      ...formData,
      skills: skillsArray,
    });
  };

  return (
    <div
      className='fixed inset-0 bg-gray-600/65 flex items-center justify-center z-50 p-4 cursor-pointer'
      onClick={onCancel}>
      <div
        className='bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>New Request</h2>
          <button
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-500 cursor-pointer transition-colors'>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            {/* Project selection */}
            <div>
              <label
                htmlFor='projectId'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Project <span className='text-red-500'>*</span>
              </label>
              <select
                id='projectId'
                name='projectId'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                value={formData.projectId}
                onChange={handleChange}>
                <option value=''>Choose project</option>
                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor='role'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Role <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='role'
                name='role'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Frontend Developer, Project Manager, etc.'
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor='skills'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Required skills
              </label>
              <input
                type='text'
                id='skills'
                name='skills'
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='React, TypeScript etc.'
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            {/* Date range */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='startDate'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Start date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='startDate'
                  name='startDate'
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  End date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Allocation */}
            <div>
              <label
                htmlFor='allocation'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Utilization (%)
              </label>
              <input
                type='number'
                id='allocation'
                name='allocation'
                min='1'
                max='100'
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                value={formData.allocation}
                onChange={handleChange}
              />
              <p className='mt-1 text-xs text-gray-500'>
                Work time percantage (1-100)
              </p>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor='notes'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Notes
              </label>
              <textarea
                id='notes'
                name='notes'
                rows={3}
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                placeholder='Additional information about request...'
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceRequestForm;
