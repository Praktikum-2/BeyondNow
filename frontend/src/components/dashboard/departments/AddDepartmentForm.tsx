import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
    onSuccess: () => void;
    onCancel: () => void;
};

export default function AddDepartmentForm({ onSuccess, onCancel }: Props) {
    const [name, setName] = useState("");
    const [leader, setLeader] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Iz .env vzamemo produkcijski URL (VITE_API_URL)
    const baseURL = import.meta.env.VITE_API_URL_LOCAL || "";

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

            await axios.post(`${baseURL}/departments`, {
                name: name.trim(),
                leader: leader.trim() || null,
            });
            setName("");
            setLeader("");
            onSuccess();
        } catch (err: any) {
            setError("Napaka pri dodajanju oddelka.");
            console.error(err);
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
                    <h2 className="text-lg font-medium text-gray-900">Dodaj nov oddelek</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-500 cursor-pointer transition-colors"
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
                            <Label htmlFor="leader">Vodja oddelka (UID) – opcijsko</Label>
                            <Input
                                id="leader"
                                placeholder="UID vodje oddelka"
                                value={leader}
                                onChange={(e) => setLeader(e.target.value)}
                            />
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
                                {loading ? "Dodajanje..." : "Dodaj oddelek"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
