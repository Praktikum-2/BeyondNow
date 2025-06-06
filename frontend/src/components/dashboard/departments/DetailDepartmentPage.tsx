import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Department = {
    name: string;
    leader?: {
        ime: string;
        priimek: string | null;
    } | null;
    employees: {
        employee_id: string;
        ime: string;
        priimek: string;
    }[];
};

const DetailDepartmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [department, setDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState(true);

    const baseURL = import.meta.env.VITE_API_URL_LOCAL || "";

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { getAuth } = await import("firebase/auth");
                const auth = getAuth();
                const currentUser = auth.currentUser;
                const token = await currentUser?.getIdToken();

                if (!token || !id) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${baseURL}/api/departments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setDepartment(data.data);
                    } else {
                        console.error("Failed to fetch department details");
                    }
                } else {
                    console.error("Failed to fetch department details");
                }
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, baseURL]);

    if (loading) return <p className="text-gray-600">Loading department details...</p>;
    if (!department) return <p className="text-gray-600">Department not found.</p>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Department Detail</h1>
                    <p className="text-sm text-gray-500 mt-1">Overview and employees of this department</p>
                </div>
            </div>

            {/* Department Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Department name</h2>
                    <p className="text-gray-700">{department.name}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Leader</h2>
                    <p className="text-gray-700">
                        {department.leader
                            ? `${department.leader.ime}${department.leader.priimek ? ` ${department.leader.priimek}` : ""}`
                            : "Ni dodeljen"}
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Število zaposlenih</h2>
                    <p className="text-gray-700">{department.employees?.length ?? 0}</p>
                </div>
            </div>

            {/* Employees List Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Zaposleni</h3>
                {(!department.employees || department.employees.length === 0) ? (
                    <p className="text-gray-500">Ni zaposlenih v tem oddelku.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {department.employees.map((emp) => (
                            <li key={emp.employee_id} className="py-2 text-gray-800 hover:bg-gray-50 px-2 rounded-md transition">
                                {emp.ime} {emp.priimek}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DetailDepartmentPage;
