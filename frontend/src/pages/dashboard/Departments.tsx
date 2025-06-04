import AddDepartmentForm from "@/components/dashboard/departments/AddDepartmentForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

type Department = {
    department_id: string;
    name: string;
    departmentLeader_id_fk: string | null;
    leader?: {
        ime: string;
        priimek: string | null;
    } | null;
};

type Employee = {
    uid: string;
    full_name: string;
};

const Departments: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const baseURL = import.meta.env.VITE_API_URL_LOCAL || "";

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const user = getAuth().currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const res = await fetch(`${baseURL}/api/departments/getAll`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();

                const departmentsWithLeader = (data.data || []).map((dep: any) => ({
                    department_id: dep.department_id,
                    name: dep.name,
                    departmentLeader_id_fk: dep.departmentLeader_id_fk,
                    leader: dep.Developer_Department_departmentLeader_id_fkToDeveloper
                        ? {
                            ime: dep.Developer_Department_departmentLeader_id_fkToDeveloper.ime,
                            priimek: dep.Developer_Department_departmentLeader_id_fkToDeveloper.priimek,
                        }
                        : null,
                }));

                setDepartments(departmentsWithLeader);
            } else {
                console.error("Failed to fetch departments");
                setDepartments([]);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            setDepartments([]);
        }
    };

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            const user = getAuth().currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const res = await fetch(`${baseURL}/employees/getAll`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                const transformedEmployees = data.map((emp: any) => ({
                    uid: emp.employee_id,
                    full_name: `${emp.ime}${emp.priimek ? ` ${emp.priimek}` : ""}`,
                }));
                setEmployees(transformedEmployees);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Poslušaj spremembo avtentikacije
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await Promise.all([fetchDepartments(), fetchEmployees()]);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // počisti listener ob unmount
    }, []);

    const getLeaderName = (leader: { ime: string; priimek: string | null } | null | undefined) => {
        if (!leader) return "Ni dodeljen";
        return `${leader.ime}${leader.priimek ? ` ${leader.priimek}` : ""}`;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Departments</h1>
                    <p className="text-sm text-gray-500 mt-1">Departments and their leaders</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={16} className="mr-2" />
                    Add Department
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
                <p className="text-gray-600">Loading departments...</p>
            ) : departments.length === 0 ? (
                <p className="text-gray-600">There are no departments. Yet!</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-700">Department name</th>
                                <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-700">Leader</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((d) => (
                                <tr key={d.department_id} className="even:bg-gray-50 hover:bg-gray-100">
                                    <td className="border border-gray-200 p-3 text-sm text-gray-900">{d.name}</td>
                                    <td className="border border-gray-200 p-3 text-sm text-gray-700">{getLeaderName(d.leader)}</td>
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
