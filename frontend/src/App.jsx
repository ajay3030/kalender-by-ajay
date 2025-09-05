// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EventTypes from "./pages/EventTypes";
import CreateEventType from "./pages/CreateEventType";
import EditEventType from "./pages/EditEventType";
import { Toaster } from "react-hot-toast";
import PublicBooking from "./pages/PublicBooking"; // Import PublicBooking
import ManageBooking from "./pages/ManageBooking";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="event-types" element={<EventTypes />} />
            <Route path="event-types/new" element={<CreateEventType />} />
            <Route path="event-types/edit/:id" element={<EditEventType />} /> 
          </Route>
          <Route path="/book/:slug" element={<PublicBooking />} /> {/* Public Booking */}
          <Route path="/booking/:id/manage" element={<ManageBooking />} /> {/* Manage Booking */}
        </Routes>
        <Toaster position="top-center" reverseOrder={false} /> 
      </BrowserRouter>
    </AuthProvider>
  );
}