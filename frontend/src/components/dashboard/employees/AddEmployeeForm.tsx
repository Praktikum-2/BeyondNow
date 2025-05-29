import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ChooseSkills } from "./ChooseSkills";

interface AddEmployeeFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

interface SkillOption {
  label: string;
  value: string;
}

const fetchSkills = async (): Promise<SkillOption[]> => {
  try {
    const res = await fetch("http://localhost:3000/skills/getAll");
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

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    ime: "",
    priimek: "",
    email: "",
    department_id_fk: "",
    skills: [] as string[], // direktno v formData
  });
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const skillsPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSkills().then(setSkillOptions);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        skillsPopoverRef.current &&
        !skillsPopoverRef.current.contains(target)
      ) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

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
    console.log(formData);
    try {
      const response = await fetch(
        "http://localhost:3000/employees/createNew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("ustvarjanje zaposlenega ni uspelo");

      const status = await response.json();
      console.log(status);
      onSubmit(status);
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-600/65 flex items-center justify-center z-50 p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>
            Dodaj zaposlenega
          </h2>
          <button
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-500 transition-colors cursor-pointer'>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='ime'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Ime<span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='ime'
                name='ime'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.ime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='priimek'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Priimek <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='priimek'
                name='priimek'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.priimek}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'>
                E-pošta <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                id='email'
                name='email'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='department_id_fk'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Oddelek <span className='text-red-500'>*</span>
              </label>
              <select
                id='department_id_fk'
                name='department_id_fk'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.department_id_fk}
                onChange={handleChange}>
                <option value=''>Izberi oddelek</option>
                <option value='28dd61fe-35a0-46da-9c30-670b11492595'>
                  Engineering
                </option>
                <option value='Design'>Design</option>
                <option value='Management'>Management</option>
                <option value='Marketing'>Marketing</option>
                <option value='Sales'>Sales</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Veščine
              </label>
              <ChooseSkills
                options={skillOptions}
                selectedSkills={formData.skills}
                onChange={(newSkills) =>
                  setFormData((prev) => ({ ...prev, skills: newSkills }))
                }
                popoverRef={skillsPopoverRef}
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              Prekliči
            </button>
            <button
              type='submit'
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'>
              Dodaj zaposlenega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
