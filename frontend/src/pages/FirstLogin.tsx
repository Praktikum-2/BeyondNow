import DashboardSkeleton from "@/components/first-login/DashboardSkeleton";
import { Input } from "@/components/ui/input";
import { getAuth } from "firebase/auth"; // če uporabljaš Firebase
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FirstLogin: React.FC = () => {
  const [organizationName, setOrganizationName] = useState("");
  const navigate = useNavigate();

  const handleCreateOrganization = async () => {
    if (!organizationName.trim()) {
      alert("Please enter an organization name");
      return;
    }

    try {
      // Pridobi trenutno Firebase Auth instanco in uporabnika
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("User is not authenticated");
        return;
      }

      // Pridobi ID token
      const token = await user.getIdToken();

      // Pošlji zahtevek na backend
      const response = await fetch("http://localhost:3000/api/organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: organizationName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Organization created:", data);
        // Preusmeri na dashboard
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error creating organization: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in handleCreateOrganization:", error);
      alert("Error creating organization. Check console for details.");
    }
  };

  const handleJoinOrganization = () => {
    navigate("/join-organization");
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="h-full w-full scale-95 blur-sm opacity-100 pointer-events-none">
          <DashboardSkeleton />
        </div>
      </div>
      <div className="bg-gray-100/20">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Welcome</h1>
            <p className="text-gray-600 mb-6">
              Get started by creating a new organization or joining an existing one.
            </p>
            <Input
              id="organization-name"
              type="text"
              placeholder="Name of your Organization"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
            <div className="flex flex-col mt-4 space-y-4">
              <button
                onClick={handleCreateOrganization}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Create Organization
              </button>
              <button
                onClick={handleJoinOrganization}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition"
              >
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
