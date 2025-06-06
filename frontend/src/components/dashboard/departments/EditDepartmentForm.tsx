import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth } from "firebase/auth";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Employee = {
    uid: string;
    full_name: string;
};

type Department = {
    department_id: string;
    name: string;
    departmentLeader_id_fk: string | null;
};

type Props = {
    existingDepartment: Department;
    onSuccess: () => void;
    onCancel: () => void;
};

export default function EditDepartmentForm({ existingDepartment, onSuccess, onCancel }: Props) {
    const [name, setName] = useState(existingDepartment.name);
    const [leader, setLeader] = useState(existingDepartment.departmentLeader_id_fk || "");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [employeesLoading, setEmployeesLoading] = useState(false);

    const baseURL = import.meta.env.VITE_API_URL_LOCAL || "";

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setEmployeesLoading(true);
                const user = getAuth().currentUser;
                if (!user) {
                    setError("Uporabnik ni prijavljen.");
                    return;
                }

                const token = await user.getIdToken();

                const res = await fetch(`${baseURL}/employees/getAll`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Napaka pri pridobivanju zaposlenih.");
                }

                const data = await res.json();
                const transformedEmployees = data.map((emp: any) => ({
                    uid: emp.employee_id,
                    full_name: `${emp.ime}${emp.priimek ? ` ${emp.priimek}` : ""}`,
                }));
                setEmployees(transformedEmployees);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Napaka pri nalaganju zaposlenih.");
            } finally {
                setEmployeesLoading(false);
            }
        };

        fetchEmployees();
    }, [baseURL]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!name.trim()) {
                setError("Ime oddelka je obvezno.");
                setLoading(false);
                return;
            }

            const user = getAuth().currentUser;
            if (!user) {
                setError("Uporabnik ni prijavljen.");
                setLoading(false);
                return;
            }

            const token = await user.getIdToken();

            const res = await fetch(`${baseURL}/api/departments/${existingDepartment.department_id}`, {
                method: "PUT", // PUT za update
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    leader: leader || null,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Napaka pri urejanju oddelka.");
            }

            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Napaka pri urejanju oddelka.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-600/65 flex items-center justify-center z-50 p-4 cursor-pointer"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Uredi oddelek</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        aria-label="Zapri modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">
                                Ime oddelka <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Vnesi ime oddelka"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <Label htmlFor="leader">Vodja oddelka – opcijsko</Label>
                            {employeesLoading ? (
                                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-2 px-3 border border-gray-300">
                                    Nalaganje zaposlenih...
                                </div>
                            ) : (
                                <select
                                    id="leader"
                                    value={leader}
                                    onChange={(e) => setLeader(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border border-gray-300"
                                >
                                    <option value="">Brez vodje</option>
                                    {employees.map((emp) => (
                                        <option key={emp.uid} value={emp.uid}>
                                            {emp.full_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                Prekliči
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? "Shranjevanje..." : "Shrani spremembe"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
