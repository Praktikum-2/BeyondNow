import { X } from "lucide-react";
import { ChooseSkills } from "../employees/ChooseSkills";
import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import type { Department } from "@/types/types";

interface AddEmployeeFormProps {
  onSubmit: (formData: any) => void;
  onClose: () => void;
  departments?: Department[];
}

interface SkillOption {
  label: string;
  value: string;
}

interface DepartmentOption {
  label: string;
  value: string;
}

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

// pridobimo departmente
const fetchDepartments = async (): Promise<DepartmentOption[]> => {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Uporabnik ni prijavljen");

    const token = await user.getIdToken();

    const res = await fetch(`${apiUrl}/api/departments/getAll`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Napaka pri pridobivanju oddelkov");
    const result = await res.json();

    return result.data.map((dept: any) => ({
      label: dept.name,
      value: dept.department_id,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

// pridobimo skille
const fetchSkills = async (): Promise<SkillOption[]> => {
  try {
    const res = await fetch(`${apiUrl}/skills/getAll`);
    if (!res.ok) throw new Error("Napaka pri pridobivanju skillov");
    const data = await res.json();
    return data.map((skill: any) => ({
      label: skill.skill,
      value: skill.skill_id || skill.name,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

const EmployeeTimelineFilter: React.FC<AddEmployeeFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    department: "",
    skills: [] as string[],
  });

  // opcije za filtre
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    DepartmentOption[]
  >([]);

  const modalRef = useRef<HTMLDivElement>(null);

  // fetchamo skille in departmente organizacije
  useEffect(() => {
    fetchSkills().then(setSkillOptions);
    fetchDepartments().then(setDepartmentOptions);
  }, []);

  // handlamo change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form data being submitted:", formData);

    // Just pass the form data to the parent component
    // Let the parent handle the API call
    onSubmit(formData);
  };

  return (
    <div className='fixed inset-0 bg-gray-600/65 flex items-center justify-center z-50 p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'> Add employee </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500 transition-colors cursor-pointer'>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='department'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Department
              </label>
              <select
                id='department'
                name='department'
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.department}
                onChange={handleChange}>
                <option value=''>Choose department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Skills
              </label>
              <ChooseSkills
                options={skillOptions}
                selectedSkills={formData.skills}
                onChange={(newSkills) =>
                  setFormData((prev) => ({ ...prev, skills: newSkills }))
                }
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-600'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeTimelineFilter;
