import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageClubs from './pages/admin/ManageClubs';
import ManagePlacements from './pages/admin/ManagePlacements';

import ClubLayout from './layouts/ClubLayout';
import ClubDashboard from './pages/club/ClubDashboard';
import ClubsPage from './pages/club/ClubsPage';
import EventsPage from './pages/club/EventsPage';
import ClubMembers from './pages/club/ClubMembers';
import EventRegistrations from './pages/club/EventRegistrations';
import ClubEventDetails from './pages/club/ClubEventDetails';
import ClubDetails from './pages/club/ClubDetails';

import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentClubs from './pages/student/StudentClubs';
import StudentEvents from './pages/student/StudentEvents';
import StudentEventDetails from './pages/student/StudentEventDetails';
import StudentClubDetails from './pages/student/StudentClubDetails';
import MyActivities from './pages/student/MyActivities';
import StudentInternships from './pages/student/StudentInternships';
import StudentJobs from './pages/student/StudentJobs';
import StudentCampusDrives from './pages/student/StudentCampusDrives';
import StudentWorkshops from './pages/student/StudentWorkshops';
import StudentConferences from './pages/student/StudentConferences';

import PlacementLayout from './layouts/PlacementLayout';
import PlacementDashboard from './pages/placement/PlacementDashboard';
import Internships from './pages/placement/Internships';
import Jobs from './pages/placement/Jobs';
import CampusDrives from './pages/placement/CampusDrives';
import Workshops from './pages/placement/Workshops';
import Conferences from './pages/placement/Conferences';
import PlacementApplicants from './pages/placement/PlacementApplicants';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="clubs" element={<ManageClubs />} />
          <Route path="placements" element={<ManagePlacements />} />
        </Route>

        {/* Club */}
        <Route path="/club" element={<ClubLayout />}>
          <Route path="dashboard" element={<ClubDashboard />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id/registrations" element={<EventRegistrations />} />
          <Route path="events/:id/details" element={<ClubEventDetails />} />
          <Route path="clubs" element={<ClubsPage />} />
          <Route path="clubs/:id/members" element={<ClubMembers />} />
          <Route path="clubs/:id/details" element={<ClubDetails />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="clubs" element={<StudentClubs />} />
          <Route path="clubs/:id" element={<StudentClubDetails />} />
          <Route path="events" element={<StudentEvents />} />
          <Route path="events/:id" element={<StudentEventDetails />} />
          <Route path="my-activities" element={<MyActivities />} />
          <Route path="internships" element={<StudentInternships />} />
          <Route path="jobs" element={<StudentJobs />} />
          <Route path="campus-drives" element={<StudentCampusDrives />} />
          <Route path="workshops" element={<StudentWorkshops />} />
          <Route path="conferences" element={<StudentConferences />} />
        </Route>

        {/* Placement */}
        <Route path="/placement" element={<PlacementLayout />}>
          <Route path="dashboard" element={<PlacementDashboard />} />
          <Route path="internships" element={<Internships />} />
          <Route path="internships/:id/applicants" element={<PlacementApplicants />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id/applicants" element={<PlacementApplicants />} />
          <Route path="campus-drives" element={<CampusDrives />} />
          <Route path="campus-drives/:id/applicants" element={<PlacementApplicants />} />
          <Route path="workshops" element={<Workshops />} />
          <Route path="workshops/:id/applicants" element={<PlacementApplicants />} />
          <Route path="conferences" element={<Conferences />} />
          <Route path="conferences/:id/applicants" element={<PlacementApplicants />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
