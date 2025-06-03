import React, { useState } from "react";
import { Plus } from "lucide-react";
import RequestsTable from "@/components/dashboard/requests/RequestsTable";
import ResourceRequestForm from "@/components/dashboard/requests/ResourceRequestForm";
import { resourceRequests, projects } from "@/data/mockData";

const Requests: React.FC = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requests, setRequests] = useState(resourceRequests);

  const handleSubmitRequest = (formData: any) => {
    // THIS WOULD SEND DATA TO BACKEND              !!!!!!!
    const newRequest = {
      id: `req${requests.length + 1}`,
      projectId: formData.projectId,
      role: formData.role,
      skills: formData.skills,
      startDate: formData.startDate,
      endDate: formData.endDate,
      allocation: formData.allocation,
      status: "pending" as const,
      notes: formData.notes,
    };

    setRequests([...requests, newRequest]);
    setShowRequestForm(false);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900'>
            Resource requests
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Managing employee demands for all projects
          </p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
          <Plus size={16} className='mr-1' />
          New request
        </button>
      </div>

      <RequestsTable requests={requests} projects={projects} />

      {showRequestForm && (
        <ResourceRequestForm
          projects={projects}
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
};

export default Requests;
