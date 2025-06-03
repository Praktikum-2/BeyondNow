import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Metrics overview skeleton */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl w-full' />
        ))}
      </div>

      {/* Main dashboard content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left column */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Utilization Chart Skeleton */}
          <Skeleton className='h-72 w-full rounded-xl' />

          {/* Project Overview Skeleton */}
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-full rounded-md' />
            ))}
          </div>
          <Skeleton className='h-72 w-full rounded-xl' />
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          {/* Resource Requests Skeleton */}
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-20 w-full rounded-lg' />
              </div>
            ))}
          </div>

          {/* Department Utilization Skeleton */}
          <Skeleton className='h-48 w-full rounded-xl' />
          <div className='space-y-4'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-20 w-full rounded-lg' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
