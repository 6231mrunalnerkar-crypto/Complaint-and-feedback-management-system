import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import About from "./pages/About";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";

import GuestComplaint from "./pages/GuestComplaint";
import TrackComplaint from "./pages/TrackComplaint";

function App() {
  return (
    <Router>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Complaint Management */}
        <Route
          path="/submit-complaint"
          element={<GuestComplaint />}
        />

        <Route
          path="/track-complaint"
          element={<TrackComplaint />}
        />

        {/* Student Portal */}
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* Staff Portal */}
        <Route
          path="/staff-dashboard"
          element={<StaffDashboard />}
        />

        {/* Admin Portal */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </Router>
  );
}

export default App;