import DashboardSkeleton from "@/components/first-login/DashboardSkeleton";
import { Input } from "@/components/ui/input";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const FirstLogin: React.FC = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { syncUser } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleCreateOrganization = async () => {
    if (!organizationName.trim()) {
      setError("Please enter an organization name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

      console.log("Creating organization...", { name: organizationName });

      const response = await fetch(`${apiUrl}/api/organization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: organizationName.trim() }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Organization created successfully:", data);
        await syncUser();
        handleAuthSuccess();
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        setError(
          `Error creating organization: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error in handleCreateOrganization:", error);
      setError("Error creating organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrganization = () => {
    navigate("/join-organization");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleCreateOrganization();
    }
  };

  return (
    <div className='relative min-h-screen bg-gray-100 overflow-hidden'>
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <div className='h-full w-full scale-95 blur-sm opacity-100 pointer-events-none'>
          <DashboardSkeleton />
        </div>
      </div>
      <div className='bg-gray-100/20'>
        <div className='relative z-10 flex items-center justify-center min-h-screen px-4'>
          <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
              Welcome
            </h1>
            <p className='text-gray-600 mb-6'>
              Get started by creating a new organization or joining an existing
              one.
            </p>

            <Input
              id='organization-name'
              type='text'
              placeholder='Name of your Organization'
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              required
            />

            {error && (
              <div className='mt-3 text-sm text-red-600 bg-red-50 p-2 rounded'>
                {error}
              </div>
            )}

            <div className='flex flex-col mt-4 space-y-4'>
              <button
                onClick={handleCreateOrganization}
                disabled={loading || !organizationName.trim()}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'>
                {loading ? "Creating Organization..." : "Create Organization"}
              </button>
              <button
                onClick={handleJoinOrganization}
                disabled={loading}
                className='w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed'>
                Join Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstLogin;
