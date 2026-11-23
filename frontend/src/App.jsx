import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerAvailability from './pages/VolunteerAvailability';
import MyApplications from './pages/MyApplications';
import NgoDashboard from './pages/NgoDashboard';
import CreateOpportunity from './pages/CreateOpportunity';
import OpportunityApplicants from './pages/OpportunityApplicants';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Volunteer Protected Routes */}
              <Route
                path="/volunteer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer/availability"
                element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <VolunteerAvailability />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer/applications"
                element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* NGO Protected Routes */}
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <NgoDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/create-opportunity"
                element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <CreateOpportunity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/opportunity/:id/applicants"
                element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <OpportunityApplicants />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin Protected Routes */}
              <Route
                path="/admin/panel"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
