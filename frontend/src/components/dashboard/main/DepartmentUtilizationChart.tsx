import React from "react";
import type { DepartmentUtilization } from "@/types/types";

interface DepartmentUtilizationChartProps {
  data: DepartmentUtilization[];
}

const DepartmentUtilizationChart: React.FC<DepartmentUtilizationChartProps> = ({
  data,
}) => {
  const sortedData = [...data].sort((a, b) => b.utilization - a.utilization);

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return "bg-red-500";
    if (utilization > 75) return "bg-yellow-500";
    if (utilization > 60) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-5'>
      <div className='mb-5'>
        <h2 className='text-lg font-medium text-gray-900'>
          Zasedenost po oddelkih
        </h2>
        <p className='text-sm text-gray-500'>
          Povprečna zasedenost v trenutnem mesecu
        </p>
      </div>

      <div className='space-y-4'>
        {sortedData.map((item) => (
          <div key={item.department} className='space-y-1'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>
                {item.department}
              </span>
              <span className='text-sm text-gray-500'>{item.utilization}%</span>
            </div>
            <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className={`h-full rounded-full ${getUtilizationColor(
                  item.utilization
                )}`}
                style={{
                  width: `${item.utilization}%`,
                  transition: "width 0.5s ease",
                }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentUtilizationChart;
