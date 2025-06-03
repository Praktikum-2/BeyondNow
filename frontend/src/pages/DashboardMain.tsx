import { Outlet, useLocation } from "react-router-dom";
import Layout from "@/components/dashboard/layout/Layout";

const titleMap: Record<string, string> = {
  "": "Home",
  timeline: "Timeline",
  employees: "Employees",
  projects: "Projects",
  reports: "Reports",
  requests: "Requests",
  settings: "Settings",
  help: "Help",
};

function DashboardMain() {
  const location = useLocation();
  const path = location.pathname.split("/")[2] || "";

  return (
    <Layout title={titleMap[path] || "Home"}>
      <Outlet />
    </Layout>
  );
}

export default DashboardMain;
