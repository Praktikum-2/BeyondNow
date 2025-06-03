import React from "react";
import { Save, Lock, Building, Database, Mail } from "lucide-react";

const Settings: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-semibold text-gray-900'>Settings</h1>
        <p className='text-sm text-gray-500 mt-1'>Managing account settings</p>
      </div>

      <div className='bg-white shadow-sm rounded-lg border border-gray-200'>
        {/* Navigation */}
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button className='border-b-2 border-blue-500 py-4 px-6 text-sm font-medium text-blue-600'>
              Account
            </button>
            <button className='border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'>
              Notifications
            </button>
            <button className='border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'>
              Security
            </button>
            <button className='border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'>
              Integrations
            </button>
          </nav>
        </div>

        {/* Settings content */}
        <div className='p-6'>
          <div className='space-y-6'>
            {/* Company Information */}
            <div>
              <h3 className='text-lg font-medium text-gray-900 flex items-center'>
                <Building size={20} className='mr-2' />
                Company Information
              </h3>
              <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                <div>
                  <label
                    htmlFor='company-name'
                    className='block text-sm font-medium text-gray-700'>
                    Company name
                  </label>
                  <input
                    type='text'
                    name='company-name'
                    id='company-name'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label
                    htmlFor='tax-id'
                    className='block text-sm font-medium text-gray-700'>
                    Tax ID
                  </label>
                  <input
                    type='text'
                    name='tax-id'
                    id='tax-id'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className='pt-6 border-t border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center'>
                <Lock size={20} className='mr-2' />
                Work Hours
              </h3>
              <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                <div>
                  <label
                    htmlFor='work-hours'
                    className='block text-sm font-medium text-gray-700'>
                    Work hours per day
                  </label>
                  <input
                    type='number'
                    name='work-hours'
                    id='work-hours'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                    defaultValue='8'
                  />
                </div>
                <div>
                  <label
                    htmlFor='work-days'
                    className='block text-sm font-medium text-gray-700'>
                    Working days
                  </label>
                  <select
                    id='work-days'
                    name='work-days'
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
                    defaultValue='mon-fri'>
                    <option value='mon-fri'>Monday - Friday</option>
                    <option value='mon-sat'>Monday - Saturday</option>
                    <option value='custom'>Custom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className='pt-6 border-t border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center'>
                <Mail size={20} className='mr-2' />
                Email settings
              </h3>
              <div className='mt-4 space-y-4'>
                <div className='flex items-center'>
                  <input
                    id='email-reports'
                    name='email-reports'
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='email-reports'
                    className='ml-2 block text-sm text-gray-900'>
                    Receive weekly reports by email
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    id='email-notifications'
                    name='email-notifications'
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='email-notifications'
                    className='ml-2 block text-sm text-gray-900'>
                    Receive notifications abouts project changes
                  </label>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className='pt-6 border-t border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center'>
                <Database size={20} className='mr-2' />
                Data Management
              </h3>
              <div className='mt-4 space-y-4'>
                <button className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
                  Export all data
                </button>
                <button className='block text-sm border px-4 py-2 border-red-200 text-red-600 rounded-md bg-red-300 hover:bg-red-250 hover:text-red-500 font-medium'>
                  Delete all data
                </button>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className='mt-6 flex justify-end'>
            <button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
              <Save size={16} className='mr-2' />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
