import React from "react";
import { ArrowUpRight, ArrowDownRight, HelpCircle } from "lucide-react";
import type { Metric } from "@/types/types";

interface MetricCardProps {
  metric: Metric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <div className='bg-white p-5 rounded-lg shadow-sm border border-gray-100'>
      <div className='flex justify-between items-start'>
        <h3 className='text-sm font-medium text-gray-500'>{metric.label}</h3>
        {metric.info && (
          <div className='relative group'>
            <HelpCircle size={16} className='text-gray-400' />
            <div className='absolute right-0 w-48 p-2 mt-2 text-xs text-gray-600 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10'>
              {metric.info}
            </div>
          </div>
        )}
      </div>
      <div className='mt-2 flex items-baseline'>
        <p className='text-2xl font-semibold text-gray-900'>{metric.value}</p>
        {metric.change !== undefined && (
          <span
            className={`ml-2 flex items-center text-sm ${
              metric.status === "positive"
                ? "text-green-600"
                : metric.status === "negative"
                ? "text-red-600"
                : "text-gray-500"
            }`}>
            {metric.change > 0 ? (
              <>
                <ArrowUpRight size={14} className='mr-1' />
                {metric.change}%
              </>
            ) : (
              <>
                <ArrowDownRight size={14} className='mr-1' />
                {Math.abs(metric.change)}%
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

interface DashboardMetricsProps {
  metrics: Metric[];
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
};

export default DashboardMetrics;
