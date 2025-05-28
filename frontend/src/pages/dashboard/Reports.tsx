import React, { useState } from "react";
import { BarChart3, Download, Calendar } from "lucide-react";
import { departmentUtilization } from "@/data/mockData";

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("utilization");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-xl font-semibold text-gray-900'>Poročila</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Analitika in poročila o zasedenosti virov
          </p>
        </div>
        <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
          <Download size={16} className='mr-2' />
          Izvozi poročilo
        </button>
      </div>

      {/* Report selection and filters */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <select
            className='block w-full sm:w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}>
            <option value='utilization'>Zasedenost virov</option>
            <option value='department'>Zasedenost po oddelkih</option>
            <option value='projects'>Projekti in alokacije</option>
            <option value='skills'>Analiza veščin</option>
          </select>
          <select
            className='block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value='week'>Tedensko</option>
            <option value='month'>Mesečno</option>
            <option value='quarter'>Četrtletno</option>
            <option value='year'>Letno</option>
          </select>
          <div className='flex-1 sm:flex-none'>
            <button className='w-full sm:w-auto inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <Calendar size={16} className='mr-2' />
              Izberi obdobje
            </button>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='space-y-6'>
          {/* Report header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <BarChart3 size={24} className='text-blue-600 mr-2' />
              <h2 className='text-lg font-medium text-gray-900'>
                {selectedReport === "utilization"
                  ? "Zasedenost virov"
                  : selectedReport === "department"
                  ? "Zasedenost po oddelkih"
                  : selectedReport === "projects"
                  ? "Projekti in alokacije"
                  : "Analiza veščin"}
              </h2>
            </div>
            <div className='text-sm text-gray-500'>
              Zadnja posodobitev: {new Date().toLocaleDateString("sl-SI")}
            </div>
          </div>

          {/* Report visualization */}
          <div className='h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg'>
            <div className='text-center'>
              <BarChart3 size={48} className='mx-auto text-gray-400 mb-4' />
              <p className='text-gray-500'>
                Vizualizacija podatkov bo na voljo v naslednji verziji
              </p>
            </div>
          </div>

          {/* Report metrics */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <div className='text-sm font-medium text-gray-500 mb-2'>
                Povprečna zasedenost
              </div>
              <div className='text-3xl font-semibold text-gray-900'>76%</div>
              <div className='text-sm text-green-600 mt-1'>
                ↑ 2.1% glede na prejšnje obdobje
              </div>
            </div>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <div className='text-sm font-medium text-gray-500 mb-2'>
                Preobremenjenost
              </div>
              <div className='text-3xl font-semibold text-gray-900'>12%</div>
              <div className='text-sm text-red-600 mt-1'>
                ↑ 4.3% glede na prejšnje obdobje
              </div>
            </div>
            <div className='p-6 bg-gray-50 rounded-lg'>
              <div className='text-sm font-medium text-gray-500 mb-2'>
                Neizkoriščenost
              </div>
              <div className='text-3xl font-semibold text-gray-900'>15%</div>
              <div className='text-sm text-green-600 mt-1'>
                ↓ 1.2% glede na prejšnje obdobje
              </div>
            </div>
          </div>

          {/* Report table */}
          <div className='mt-6'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Oddelek
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Zasedenost
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {departmentUtilization.map((dept, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {dept.department}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {dept.utilization}%
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='w-24 h-2 bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-blue-600 rounded-full'
                          style={{ width: `${dept.utilization}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
