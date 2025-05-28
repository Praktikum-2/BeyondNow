import { Outlet, useLocation } from "react-router-dom";
import Layout from "@/components/dashboard/layout/Layout";

const titleMap: Record<string, string> = {
  "": "Nadzorna plošča",
  timeline: "Časovnica",
  employees: "Zaposleni",
  projects: "Projekti",
  reports: "Poročila",
  requests: "Zahteve",
  settings: "Nastavitve",
  help: "Pomoč",
};

function DashboardMain() {
  const location = useLocation();
  const path = location.pathname.split("/")[2] || "";

  return (
    <Layout title={titleMap[path] || "Nadzorna plošča"}>
      <Outlet />
    </Layout>
  );
}

export default DashboardMain;
