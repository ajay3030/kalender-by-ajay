// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-primary">Calendly-Clone</Link>

      <div className="space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="text-primary">Login</Link>
            <Link to="/register" className="bg-primary text-white px-3 py-1 rounded">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-primary">Dashboard</Link>
            <span className="text-sm">{user.name}</span>
            <button onClick={logout} className="text-danger">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}