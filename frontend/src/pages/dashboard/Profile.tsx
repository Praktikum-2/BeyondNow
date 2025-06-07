import DashboardMetrics from "@/components/dashboard/main/DashboardMetrics";
import { useAuth } from "@/contexts/authContext";
import { dashboardMetrics } from "@/data/mockData";
import clsx from "clsx";
import { Check, Pencil } from "lucide-react";
import React, { useState } from "react";

const Profile: React.FC = () => {
    const { userData, currentUser } = useAuth();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingOrg, setIsEditingOrg] = useState(false);

    const [name, setName] = useState(userData?.name || "");
    const [organizationName, setOrganizationName] = useState(
        userData?.organization?.name || "Not set"
    );

    const handleSave = async (field: "name" | "organization") => {
        if (field === "name") {
            setIsEditingName(false);
            // TODO: Pošlji ime na backend
            console.log("Shranjeno ime:", name);
        } else if (field === "organization") {
            setIsEditingOrg(false);
            // TODO: Pošlji organizacijo na backend
            console.log("Shranjeno ime organizacije:", organizationName);
        }
    };

    const handleKeyDown =
        (field: "name" | "organization") =>
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave(field);
                }
            };

    return (
        <div className='space-y-6'>
            {/* Profile Header */}
            <div className='bg-white rounded-lg shadow p-6 border'>
                <div className='flex justify-between items-start'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                            Profile Overview
                        </h1>
                        <p className='text-sm text-gray-600'>
                            View and manage your profile information.
                        </p>
                    </div>
                </div>
            </div>

            {/* User Info Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

                {/* Name */}
                <div className='bg-white p-5 rounded-lg shadow-sm border space-y-2'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-sm font-medium text-gray-500'>Name</h3>
                        <button
                            onClick={() =>
                                isEditingName ? handleSave("name") : setIsEditingName(true)
                            }
                            className='text-gray-400 hover:text-gray-600'
                        >
                            {isEditingName ? <Check size={16} /> : <Pencil size={16} />}
                        </button>
                    </div>
                    {isEditingName ? (
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            className={clsx(
                                "text-lg font-semibold text-gray-900 border rounded px-2 py-1 focus:outline-none focus:ring",
                                "focus:ring-blue-500"
                            )}
                            onInput={(e) =>
                                setName((e.target as HTMLDivElement).innerText)
                            }
                            onKeyDown={handleKeyDown("name")}
                        >
                            {name}
                        </div>
                    ) : (
                        <p className='text-lg font-semibold text-gray-900'>{name}</p>
                    )}
                </div>

                {/* Email - read only */}
                <div className='bg-white p-5 rounded-lg shadow-sm border space-y-2'>
                    <h3 className='text-sm font-medium text-gray-500'>Email</h3>
                    <p className='text-lg font-semibold text-gray-900'>
                        {userData?.email || currentUser?.email}
                    </p>
                </div>

                {/* Organization */}
                <div className='bg-white p-5 rounded-lg shadow-sm border space-y-2'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-sm font-medium text-gray-500'>Organization</h3>
                        <button
                            onClick={() =>
                                isEditingOrg ? handleSave("organization") : setIsEditingOrg(true)
                            }
                            className='text-gray-400 hover:text-gray-600'
                        >
                            {isEditingOrg ? <Check size={16} /> : <Pencil size={16} />}
                        </button>
                    </div>
                    {isEditingOrg ? (
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            className={clsx(
                                "text-lg font-semibold text-gray-900 border rounded px-2 py-1 focus:outline-none focus:ring",
                                "focus:ring-blue-500"
                            )}
                            onInput={(e) =>
                                setOrganizationName((e.target as HTMLDivElement).innerText)
                            }
                            onKeyDown={handleKeyDown("organization")}
                        >
                            {organizationName}
                        </div>
                    ) : (
                        <p className='text-lg font-semibold text-gray-900'>
                            {organizationName}
                        </p>
                    )}
                </div>
            </div>

            {/* User Statistics */}
            <div>
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>
                    Your Statistics
                </h2>
                <DashboardMetrics metrics={dashboardMetrics} />
            </div>
        </div>
    );
};

export default Profile;
