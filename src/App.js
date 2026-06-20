import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard";
import BlogDetail from "./pages/BlogDetail";
import EmployerDetail from "./pages/EmployerDetail";
import ApplicantOnboarding from "./pages/ApplicantOnboarding";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import FormDemo from "./pages/FormDemo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Job Board Home */}
        <Route path="/" element={<Home />} />
        
        {/* Public Auth Page */}
        <Route path="/auth" element={<Auth />} />

        {/* Onboarding Pages */}
        <Route path="/applicant-onboarding" element={<ApplicantOnboarding />} />
        <Route path="/employer-onboarding" element={<EmployerOnboarding />} />

        {/* Demo Forms Page */}
        <Route path="/form-demo" element={<FormDemo />} />

        {/* Public Job Detail Page */}
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Public Employer Detail Page */}
        <Route path="/employers/:id" element={<EmployerDetail />} />

        {/* Public Blog Detail Page */}
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Role-Based Protected Dashboard (internally handles login checking) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;