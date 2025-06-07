import DashboardMetrics from "@/components/dashboard/main/DashboardMetrics";
import { useAuth } from "@/contexts/authContext";
import { dashboardMetrics } from "@/data/mockData";
import { Check, Pencil } from "lucide-react";
import React, { useState } from "react";

const Profile: React.FC = () => {
    const { userData, currentUser, syncUser } = useAuth();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingOrg, setIsEditingOrg] = useState(false);

    const [name, setName] = useState(userData?.name || "");
    const [organizationName, setOrganizationName] = useState(
        userData?.organization?.name || "Not set"
    );

    const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

    const handleSave = async (field: "name" | "organization") => {
        if (!currentUser) {
            alert("User not logged in");
            return;
        }

        try {
            const idToken = await currentUser.getIdToken();

            let payload = {};
            if (field === "name") {
                payload = { name };  // ime mora biti string iz state-a
            } else if (field === "organization") {
                payload = { organizationName };  // ne uporabi objekt, ampak samo string
            }

            console.log("Payload for update:", payload);

            const response = await fetch(`${apiUrl}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json();
                console.error("Backend error:", err);
                alert(`Napaka: ${err.message}\nPodrobnosti: ${JSON.stringify(err)}`);
                throw new Error(err.message || "Error updating profile");
            }

            if (field === "name") setIsEditingName(false);
            if (field === "organization") setIsEditingOrg(false);

            await syncUser();
        } catch (error: any) {
            alert("Napaka pri shranjevanju: " + error.message);
        }
    };




    const handleKeyDown =
        (field: "name" | "organization") =>
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave(field);
                }
            };

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6 border">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Profile Overview
                        </h1>
                        <p className="text-sm text-gray-600">
                            View and manage your profile information.
                        </p>
                    </div>
                </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name */}
                <div className="bg-white p-5 rounded-lg shadow-sm border space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <button
                            onClick={() =>
                                isEditingName ? handleSave("name") : setIsEditingName(true)
                            }
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {isEditingName ? <Check size={16} /> : <Pencil size={16} />}
                        </button>
                    </div>
                    {isEditingName ? (
                        <input
                            type="text"
                            className="w-full text-lg font-semibold text-gray-900 border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown("name")}
                            autoFocus
                        />
                    ) : (
                        <p className="text-lg font-semibold text-gray-900">{name}</p>
                    )}
                </div>

                {/* Email - read only */}
                <div className="bg-white p-5 rounded-lg shadow-sm border space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-lg font-semibold text-gray-900">
                        {userData?.email || currentUser?.email}
                    </p>
                </div>

                {/* Organization */}
                <div className="bg-white p-5 rounded-lg shadow-sm border space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-500">Organization</h3>
                        <button
                            onClick={() =>
                                isEditingOrg ? handleSave("organization") : setIsEditingOrg(true)
                            }
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {isEditingOrg ? <Check size={16} /> : <Pencil size={16} />}
                        </button>
                    </div>
                    {isEditingOrg ? (
                        <input
                            type="text"
                            className="w-full text-lg font-semibold text-gray-900 border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            onKeyDown={handleKeyDown("organization")}
                            autoFocus
                        />
                    ) : (
                        <p className="text-lg font-semibold text-gray-900">{organizationName}</p>
                    )}
                </div>
            </div>

            {/* User Statistics */}
            <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Your Statistics
                </h2>
                <DashboardMetrics metrics={dashboardMetrics} />
            </div>
        </div>
    );
};

export default Profile;
