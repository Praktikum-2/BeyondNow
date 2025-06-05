import type {
  Employee,
  ResourceRequest,
  UtilizationData,
  DepartmentUtilization,
  Metric,
  ProjectMock,
} from "../types/types";

const today = new Date();
const getDateString = (daysFromToday: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0];
};

export const employees: Employee[] = [
  {
    id: "emp1",
    name: "Ana Kovač",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "CSS", "UI/UX"],
    imageUrl:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    department: "Engineering",
    email: "ana.kovac@example.com",
    availability: Array.from({ length: 30 }, (_, i) => ({
      date: getDateString(i),
      available: i < 14 ? 20 : 80,
      projects: i < 14 ? [{ projectId: "proj1", allocation: 80 }] : [],
    })),
  },
  {
    id: "emp2",
    name: "Marko Novak",
    role: "Backend Developer",
    skills: ["Node.js", "Express", "MongoDB", "API Design"],
    imageUrl:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    department: "Engineering",
    email: "marko.novak@example.com",
    availability: Array.from({ length: 30 }, (_, i) => ({
      date: getDateString(i),
      available: i > 7 && i < 21 ? 0 : 100,
      projects:
        i > 7 && i < 21 ? [{ projectId: "proj2", allocation: 100 }] : [],
    })),
  },
  {
    id: "emp3",
    name: "Nina Horvat",
    role: "Project Manager",
    skills: ["Agile", "Scrum", "Project Planning", "Stakeholder Management"],
    imageUrl:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    department: "Management",
    email: "nina.horvat@example.com",
    availability: Array.from({ length: 30 }, (_, i) => ({
      date: getDateString(i),
      available: 30,
      projects: [
        { projectId: "proj1", allocation: 40 },
        { projectId: "proj2", allocation: 30 },
      ],
    })),
  },
  {
    id: "emp4",
    name: "Luka Zupančič",
    role: "UX Designer",
    skills: ["UI Design", "User Research", "Prototyping", "Figma"],
    imageUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    department: "Design",
    email: "luka.zupancic@example.com",
    availability: Array.from({ length: 30 }, (_, i) => ({
      date: getDateString(i),
      available: i < 10 ? 100 : 50,
      projects: i < 10 ? [] : [{ projectId: "proj3", allocation: 50 }],
    })),
  },
  {
    id: "emp5",
    name: "Eva Krajnc",
    role: "QA Engineer",
    skills: ["Test Automation", "Manual Testing", "QA Processes", "Selenium"],
    imageUrl:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    department: "Engineering",
    email: "eva.krajnc@example.com",
    availability: Array.from({ length: 30 }, (_, i) => ({
      date: getDateString(i),
      available: i % 2 === 0 ? 0 : 40,
      projects:
        i % 2 === 0
          ? [
              { projectId: "proj1", allocation: 60 },
              { projectId: "proj3", allocation: 40 },
            ]
          : [{ projectId: "proj1", allocation: 60 }],
    })),
  },
];

export const projects: ProjectMock[] = [
  {
    project_id: "proj1",
    name: "E-commerce Platform",
    start_date: getDateString(-10),
    end_date: getDateString(20),
    status: "active",
    description:
      "Development of a modern e-commerce platform with inventory management.",
    teamMembers: [
      {
        employeeId: "emp1",
        allocation: 80,
        startDate: getDateString(-10),
        endDate: getDateString(14),
      },
      {
        employeeId: "emp3",
        allocation: 40,
        startDate: getDateString(-10),
        endDate: getDateString(20),
      },
      {
        employeeId: "emp5",
        allocation: 60,
        startDate: getDateString(-5),
        endDate: getDateString(20),
      },
    ],
    requiredRoles: [
      {
        id: "req1",
        projectId: "proj1",
        role: "Frontend Developer",
        skills: ["React", "TypeScript"],
        startDate: getDateString(15),
        endDate: getDateString(45),
        allocation: 100,
        status: "pending",
        notes: "Needed for UI implementation phase.",
      },
    ],
  },
  {
    project_id: "proj2",
    name: "Banking App Redesign",
    start_date: getDateString(5),
    end_date: getDateString(35),
    status: "planned",
    description:
      "Redesign of the mobile banking application with enhanced security features.",
    teamMembers: [
      {
        employeeId: "emp2",
        allocation: 100,
        startDate: getDateString(8),
        endDate: getDateString(21),
      },
      {
        employeeId: "emp3",
        allocation: 30,
        startDate: getDateString(5),
        endDate: getDateString(35),
      },
    ],
    requiredRoles: [
      {
        id: "req2",
        projectId: "proj2",
        role: "UX Designer",
        skills: ["UI Design", "User Research"],
        startDate: getDateString(5),
        endDate: getDateString(20),
        allocation: 50,
        status: "pending",
        notes: "Need someone with financial app experience.",
      },
      {
        id: "req3",
        projectId: "proj2",
        role: "Backend Developer",
        skills: ["Node.js", "Security"],
        startDate: getDateString(22),
        endDate: getDateString(35),
        allocation: 100,
        status: "pending",
        notes: "For implementing security features.",
      },
    ],
  },
  {
    project_id: "proj3",
    name: "Healthcare Portal",
    start_date: getDateString(10),
    end_date: getDateString(50),
    status: "planned",
    description:
      "Patient portal for appointment scheduling and medical record access.",
    teamMembers: [
      {
        employeeId: "emp4",
        allocation: 50,
        startDate: getDateString(10),
        endDate: getDateString(30),
      },
      {
        employeeId: "emp5",
        allocation: 40,
        startDate: getDateString(0),
        endDate: getDateString(15),
      },
    ],
    requiredRoles: [
      {
        id: "req4",
        projectId: "proj3",
        role: "Backend Developer",
        skills: ["Node.js", "Data Security"],
        startDate: getDateString(15),
        endDate: getDateString(40),
        allocation: 80,
        status: "pending",
        notes: "HIPAA compliance experience required.",
      },
      {
        id: "req5",
        projectId: "proj3",
        role: "QA Engineer",
        skills: ["Test Automation", "Healthcare"],
        startDate: getDateString(30),
        endDate: getDateString(50),
        allocation: 100,
        status: "pending",
        notes: "For extensive testing of patient-facing features.",
      },
    ],
  },
];

export const resourceRequests: ResourceRequest[] = [
  {
    id: "req1",
    projectId: "proj1",
    role: "Frontend Developer",
    skills: ["React", "TypeScript"],
    startDate: getDateString(15),
    endDate: getDateString(45),
    allocation: 100,
    status: "pending",
    notes: "Needed for UI implementation phase.",
  },
  {
    id: "req2",
    projectId: "proj2",
    role: "UX Designer",
    skills: ["UI Design", "User Research"],
    startDate: getDateString(5),
    endDate: getDateString(20),
    allocation: 50,
    status: "pending",
    notes: "Need someone with financial app experience.",
  },
  {
    id: "req3",
    projectId: "proj2",
    role: "Backend Developer",
    skills: ["Node.js", "Security"],
    startDate: getDateString(22),
    endDate: getDateString(35),
    allocation: 100,
    status: "pending",
    notes: "For implementing security features.",
  },
  {
    id: "req4",
    projectId: "proj3",
    role: "Backend Developer",
    skills: ["Node.js", "Data Security"],
    startDate: getDateString(15),
    endDate: getDateString(40),
    allocation: 80,
    status: "pending",
    notes: "HIPAA compliance experience required.",
  },
  {
    id: "req5",
    projectId: "proj3",
    role: "QA Engineer",
    skills: ["Test Automation", "Healthcare"],
    startDate: getDateString(30),
    endDate: getDateString(50),
    allocation: 100,
    status: "pending",
    notes: "For extensive testing of patient-facing features.",
  },
];

export const utilizationData: UtilizationData[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = getDateString(i);
    const utilized = 50 + Math.sin(i / 5) * 20;
    const overallocated = Math.max(0, Math.sin(i / 3) * 15);
    return {
      date,
      utilized,
      available: 100 - utilized - overallocated,
      overallocated,
    };
  }
);

export const departmentUtilization: DepartmentUtilization[] = [
  { department: "Engineering", utilization: 78 },
  { department: "Design", utilization: 65 },
  { department: "Management", utilization: 82 },
  { department: "Marketing", utilization: 45 },
  { department: "Sales", utilization: 60 },
];

export const dashboardMetrics: Metric[] = [
  { label: "Total Employees", value: 42, change: 3, status: "positive" },
  { label: "Active Projects", value: 7, change: 1, status: "positive" },
  { label: "Avg. Utilization", value: "68%", change: -2, status: "negative" },
  { label: "Open Resource Requests", value: 12, change: 4, status: "negative" },
  { label: "Upcoming Project Starts", value: 3, info: "Next 30 days" },
];
