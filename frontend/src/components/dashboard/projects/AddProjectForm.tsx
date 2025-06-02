import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ChooseManager } from "@/components/dashboard/projects/ChooseManager";

const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

interface AddProjectFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

interface ManagerOption {
  label: string;
  value: string;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    projectManager_id: null as string | null,
    status: "planned",
  });

  const [managerOptionsList, setManagerOptionsList] = useState<ManagerOption[]>(
    []
  );

  const modalRef = useRef<HTMLDivElement>(null);
  const managerPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(`${apiUrl}/employees/getAll`);
        if (!response.ok) throw new Error("Napaka pri pridobivanju zaposlenih");
        const employees = await response.json();

        const options = employees.map((emp: any) => ({
          label: `${emp.ime} ${emp.priimek}`,
          value: emp.employee_id,
        }));

        setManagerOptionsList(options);
      } catch (error) {
        console.error("Napaka pri fetchanju managerjev:", error);
        setManagerOptionsList([]);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !managerPopoverRef.current?.contains(target)
      ) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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

  const handleManagerChange = (newValue: string) => {
    setFormData((prev) => ({
      ...prev,
      projectManager_id: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Napaka pri ustvarjanju projekta");

      const data = await response.json();
      console.log("Ustvarjen projekt:", data);
      onSubmit(data);
    } catch (error) {
      console.error("Napaka:", error);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-600/65 flex items-center justify-center z-50 p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>Nov projekt</h2>
          <button
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-500 transition-colors cursor-pointer'
            aria-label='Zapri'>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Ime projekta <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='name'
                name='name'
                required
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Opis projekta
              </label>
              <textarea
                id='description'
                name='description'
                rows={3}
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='start_date'
                  className='block text-sm font-medium text-gray-700 mb-1 p-[5px]'>
                  Začetni datum <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='start_date'
                  name='start_date'
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor='end_date'
                  className='block text-sm font-medium text-gray-700 mb-1 p-[5px]'>
                  Končni datum <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='end_date'
                  name='end_date'
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Vodja projekta
              </label>
              <ChooseManager
                options={managerOptionsList}
                value={formData.projectManager_id}
                onChange={handleManagerChange}
                popoverRef={managerPopoverRef}
              />
            </div>

            <div>
              <label
                htmlFor='status'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Status
              </label>
              <select
                id='status'
                name='status'
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-[5px]'
                value={formData.status}
                onChange={handleChange}>
                <option value='planned'>Načrtovan</option>
                <option value='active'>Aktiven</option>
                <option value='on-hold'>Na čakanju</option>
              </select>
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
              Ustvari projekt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;
