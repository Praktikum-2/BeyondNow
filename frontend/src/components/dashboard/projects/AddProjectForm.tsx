import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ChooseManager } from "@/components/dashboard/projects/ChooseManager";

interface AddProjectFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const managerOptions = [
  { label: "Ana Novak", value: "ana" },
  { label: "Marko Kranjc", value: "marko" },
  { label: "Eva Zupan", value: "eva" },
];

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planned",
    manager: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const managerPopoverRef = useRef<HTMLDivElement>(null);

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
      manager: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: `proj${Date.now()}`,
      teamMembers: [],
      requiredRoles: [],
    });
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
            className='text-gray-400 hover:text-gray-500 transition-colors cursor-pointer'>
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
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='startDate'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Začetni datum <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='startDate'
                  name='startDate'
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium text-gray-700 mb-1'>
                  Končni datum <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  required
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Vodja projekta
              </label>
              <ChooseManager
                options={managerOptions}
                placeholder='Izberi vodjo...'
                value={formData.manager}
                onChange={handleManagerChange}
                popoverRef={managerPopoverRef} // 🔧 Ključni prop
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
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
