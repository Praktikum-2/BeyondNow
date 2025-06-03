import AddDepartmentForm from "@/components/dashboard/departments/AddDepartmentForm";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

type Department = {
    department_id: string;
    name: string;
    leader: string | null;
};

const Departments: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Iz .env vzamemo produkcijski URL (VITE_API_URL)
    const baseURL = import.meta.env.VITE_API_URL || "";

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${baseURL}/departments/getAll`);
            const rawData = await response.json();

            const departmentList = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData.data)
                    ? rawData.data
                    : [];

            setDepartments(departmentList);
        } catch (error) {
            console.error("Napaka pri nalaganju oddelkov", error);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Oddelki</h1>
                    <p className="text-sm text-gray-500 mt-1">Pregled in upravljanje oddelkov</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={16} className="mr-2" />
                    Dodaj oddelek
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <AddDepartmentForm
                    onSuccess={() => {
                        fetchDepartments();
                        setShowAddForm(false);
                    }}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* Content */}
            {loading ? (
                <p className="text-gray-600">Nalaganje oddelkov...</p>
            ) : departments.length === 0 ? (
                <p className="text-gray-600">Ni še nobenega oddelka.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-700">Ime</th>
                                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-700">Vodja</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((d) => (
                                <tr key={d.department_id} className="even:bg-gray-50 hover:bg-gray-100">
                                    <td className="border border-gray-200 p-3 text-sm text-gray-900">{d.name}</td>
                                    <td className="border border-gray-200 p-3 text-sm text-gray-700">{d.leader || "Ni dodeljen"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Departments;
