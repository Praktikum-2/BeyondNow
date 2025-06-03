import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import DashboardMain from "./pages/DashboardMain";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/dashboard/Home";
import Timeline from "./pages/dashboard/Timeline";
import Requests from "./pages/dashboard/Requests";
import Employees from "./pages/dashboard/Employees";
import Projects from "./pages/dashboard/Projects";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";
import FirstLogin from "./pages/FirstLogin";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/startup' element={<FirstLogin />} />
      <Route path='/dashboard' element={<DashboardMain />}>
        <Route index element={<Dashboard />} />
        <Route path='timeline' element={<Timeline />} />
        <Route path='requests' element={<Requests />} />
        <Route path='employees' element={<Employees />} />
        <Route path='projects' element={<Projects />} />
        <Route path='reports' element={<Reports />} />
        <Route path='settings' element={<Settings />} />
        <Route path='help' element={<div>Help coming soon...</div>} />
      </Route>
    </Routes>
  );
}

export default App;
