import AddDepartmentForm from "@/components/dashboard/departments/AddDepartmentForm";
import EditDepartmentForm from "@/components/dashboard/departments/EditDepartmentForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Dodaj na vrh

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
    const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

    const baseURL = import.meta.env.VITE_API_URL_LOCAL || "";

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

    const deleteDepartment = async (id: string) => {
        try {
            const user = getAuth().currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            const res = await fetch(`${baseURL}/api/departments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                fetchDepartments();
                setDepartmentToDelete(null);
            }
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await Promise.all([fetchDepartments(), fetchEmployees()]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getLeaderName = (leader: { ime: string; priimek: string | null } | null | undefined) => {
        if (!leader) return "Ni dodeljen";
        return `${leader.ime}${leader.priimek ? ` ${leader.priimek}` : ""}`;
    };
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Departments</h1>
                    <p className="text-sm text-gray-500 mt-1">Departments and their leaders</p>
                </div>
                <button
                    onClick={() => {
                        setDepartmentToEdit(null);
                        setShowAddForm(true);
                    }}
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
                        setDepartmentToEdit(null);
                    }}
                    onCancel={() => {
                        setShowAddForm(false);
                        setDepartmentToEdit(null);
                    }}
                />
            )}

            {/* Edit Form */}
            {departmentToEdit && (
                <EditDepartmentForm
                    existingDepartment={departmentToEdit}
                    onSuccess={() => {
                        fetchDepartments();
                        setDepartmentToEdit(null);
                    }}
                    onCancel={() => setDepartmentToEdit(null)}
                />
            )}

            {/* Delete Modal */}
            {departmentToDelete && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                    <p className="mb-6 text-gray-700">
                        Are you sure you want to delete the department <strong>{departmentToDelete.name}</strong>?
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setDepartmentToDelete(null)}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => deleteDepartment(departmentToDelete.department_id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}


            {/* Table */}
            {loading ? (
                <p className="text-gray-600">Loading departments...</p>
            ) : departments.length === 0 ? (
                <p className="text-gray-600">There are no departments. Yet!</p>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Leader
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {departments.map((d) => (
                                <tr key={d.department_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm" ><button className="hover:underline text-sm" onClick={() => navigate(`../../dashboard/departments/${d.department_id}`)}>{d.name}</button></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {getLeaderName(d.leader)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-10">
                                        <button
                                            className="text-blue-600 hover:underline text-sm "
                                            onClick={() => setDepartmentToEdit(d)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline text-sm"
                                            onClick={() => setDepartmentToDelete(d)}
                                        >
                                            Delete
                                        </button>
                                    </td>
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
