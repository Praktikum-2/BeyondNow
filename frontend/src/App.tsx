import { Route, Routes } from "react-router-dom";
import DetailDepartmentPage from "./components/dashboard/departments/DetailDepartmentPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/authContext";
import Departments from "./pages/dashboard/Departments";
import Employees from "./pages/dashboard/Employees";
import Dashboard from "./pages/dashboard/Home";
import Projects from "./pages/dashboard/Projects";
import Reports from "./pages/dashboard/Reports";
import Requests from "./pages/dashboard/Requests";
import Settings from "./pages/dashboard/Settings";
import Timeline from "./pages/dashboard/Timeline";
import DashboardMain from "./pages/DashboardMain";
import FirstLogin from "./pages/FirstLogin";
import Landing from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import NotFound from "./pages/NotFound"; // Add this import

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Landing />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute redirectIfAuthenticated>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <ProtectedRoute redirectIfAuthenticated>
              <SignupPage />
            </ProtectedRoute>
          }
        />
        {/* Protected route for first-time setup */}
        <Route
          path='/startup'
          element={
            <ProtectedRoute>
              <FirstLogin />
            </ProtectedRoute>
          }
        />
        {/* Protected dashboard routes - require organization */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute requiresOrganization>
              <DashboardMain />
            </ProtectedRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path='departments' element={<Departments />} />
          <Route path='departments/:id' element={<DetailDepartmentPage />} />
          <Route path='employees' element={<Employees />} />
          <Route path='projects' element={<Projects />} />
          <Route path='requests' element={<Requests />} />
          <Route path='reports' element={<Reports />} />
          <Route path='timeline' element={<Timeline />} />
          <Route path='settings' element={<Settings />} />
          <Route path='help' element={<div>Help coming soon...</div>} />
          {/* Catch-all route for unknown dashboard routes */}
          <Route path='*' element={<NotFound />} />
        </Route>
        {/* Catch-all route for any other unknown routes */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
