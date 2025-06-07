import { useAuth } from "@/contexts/authContext";
import type { Metric } from "@/types/types";
//import { ArrowDownRight, ArrowUpRight, HelpCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DashboardMetricsProps { }

const DashboardMetrics: React.FC<DashboardMetricsProps> = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL_LOCAL;

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        setLoading(true);
        setError(null);

        const idToken = await currentUser.getIdToken();
        const response = await fetch(`${apiUrl}/api/metrics`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch metrics");
        }

        const data = await response.json();

        // Transform API response to Metric format
        const transformedMetrics: Metric[] = [
          {
            label: "Employees",
            value: data.data.employeesCount,
            change: 0, // You can add change calculation if needed
            status: "neutral",
            info: "Total number of employees",
          },
          {
            label: "Departments",
            value: data.data.departmentsCount,
            change: 0,
            status: "neutral",
            info: "Total number of departments",
          },
          {
            label: "Projects",
            value: data.data.projectsCount,
            change: 0,
            status: "neutral",
            info: "Total number of active projects",
          },
        ];

        setMetrics(transformedMetrics);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [currentUser, apiUrl]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">{metric.label}</h3>
            {metric.info && (
              <div className="relative group">
                <div className="absolute right-0 w-48 p-2 mt-2 text-xs text-gray-600 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {metric.info}
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
            {/*
            {metric.change !== undefined && (
              <span
                className={`ml-2 flex items-center text-sm ${metric.status === "positive"
                    ? "text-green-600"
                    : metric.status === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
              >
                {metric.change > 0 ? (
                  <>
                    <ArrowUpRight size={14} className="mr-1" />
                    {metric.change}%
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={14} className="mr-1" />
                    {Math.abs(metric.change)}%
                  </>
                )}
              </span>
            )}*/}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;