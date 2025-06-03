import React from "react";
import type { UtilizationData } from "@/types/types";

interface UtilizationChartProps {
  data: UtilizationData[];
}

const UtilizationChart: React.FC<UtilizationChartProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("sl-SI", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const chartHeight = 200;
  const barWidth = `calc(100% / ${data.length})`;
  const barMargin = 2;

  const chartData = data.slice(0, 7);

  return (
    <div className='bg-white rounded-xl shadow-md border border-gray-100 p-6'>
      <div className='mb-5'>
        <h2 className='text-xl font-semibold text-gray-900'>
          Resource utilization
        </h2>
        <p className='text-sm text-gray-500'>
          {" "}
          Last week utilization managing{" "}
        </p>
      </div>

      <div className='mt-4'>
        <div className='relative h-[200px]'>
          {/* Y-axis labels */}
          <div className='absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-1 leading-none'>
            {[100, 75, 50, 25, 0].map((val) => (
              <span key={val}>{val}%</span>
            ))}
          </div>

          {/* Grid lines */}
          <div className='absolute left-8 top-0 w-[calc(100%-2rem)] h-full flex flex-col justify-between pointer-events-none py-1'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='border-t border-dashed border-gray-200 w-full'></div>
            ))}
          </div>

          {/* Chart bars */}
          <div className='ml-8 h-full flex items-end'>
            {chartData.map((item, index) => (
              <div
                key={index}
                className='relative flex flex-col justify-end h-full group'
                style={{ width: barWidth, marginRight: `${barMargin}px` }}>
                {/* Overallocated */}
                {item.overallocated > 0 && (
                  <div
                    className='w-full bg-red-400 group-hover:brightness-110'
                    style={{
                      height: `${(item.overallocated / 100) * chartHeight}px`,
                      transition: "all 0.3s ease",
                    }}
                    title={`Overutilized: ${item.overallocated.toFixed(
                      1
                    )}%`}></div>
                )}

                {/* Utilized */}
                <div
                  className='w-full bg-blue-400 group-hover:brightness-110'
                  style={{
                    height: `${(item.utilized / 100) * chartHeight}px`,
                    transition: "all 0.3s ease",
                  }}
                  title={`Utilized: ${item.utilized.toFixed(1)}%`}></div>

                {/* Available */}
                <div
                  className='w-full bg-green-300 group-hover:brightness-110'
                  style={{
                    height: `${(item.available / 100) * chartHeight}px`,
                    transition: "all 0.3s ease",
                  }}
                  title={`Available: ${item.available.toFixed(1)}%`}></div>

                {/* X-axis label */}
                <div className='absolute -bottom-6 w-full text-center text-xs text-gray-500'>
                  {formatDate(item.date)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='flex items-center justify-center mt-10 space-x-6 text-sm'>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-red-400 rounded-sm'></div>
            <span className='text-gray-600'>Overutilized</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-blue-400 rounded-sm'></div>
            <span className='text-gray-600'>Utilized</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 bg-green-300 rounded-sm'></div>
            <span className='text-gray-600'>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilizationChart;
