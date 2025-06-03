import React from "react";
import {
  Users,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  FileCheck,
  BarChart2,
} from "lucide-react";
import Container from "@/components/ui/ContainerLanding";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className='p-6 rounded-xl transition-all duration-300 hover:bg-gray-200 bg-gray-50'>
    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-5'>
      {icon}
    </div>
    <h3 className='text-xl font-medium text-gray-900 mb-3'>{title}</h3>
    <p className='text-gray-600 leading-relaxed'>{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <Users size={22} />,
      title: "Team Availability Overview",
      description:
        "Easily visualize when and where your employees are available using clear timelines and calendar views.",
    },
    {
      icon: <LayoutDashboard size={22} />,
      title: "Project-Based Planning",
      description:
        "Plan resources across multiple projects and ensure optimal allocation of skills and availability.",
    },
    {
      icon: <Calendar size={22} />,
      title: "Smart Scheduling",
      description:
        "Dynamically plan new projects based on current workload and availability, avoiding overbooking.",
    },
    {
      icon: <ClipboardList size={22} />,
      title: "Role & Skill Matching",
      description:
        "Assign employees based on their roles and competencies to meet specific project requirements.",
    },
    {
      icon: <FileCheck size={22} />,
      title: "Request & Approval Workflow",
      description:
        "Create and manage human resource requests with built-in approval flows for streamlined staffing.",
    },
    {
      icon: <BarChart2 size={22} />,
      title: "Insightful Reporting",
      description:
        "Get visual reports and insights into team workload, capacity gaps, and future planning needs.",
    },
  ];

  return (
    <section id='features' className='py-20 md:py-28 bg-white'>
      <Container>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-medium text-gray-900 mb-4'>
            Smarter Project Planning
          </h2>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed'>
            Streamline resource allocation, optimize team workload, and improve
            project outcomes with our intuitive planning tool.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
