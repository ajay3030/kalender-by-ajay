// frontend/src/components/Navigation/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard',  path: '/dashboard', icon: HomeIcon },
  { name: 'Event Types',path: '/event-types',icon: CalendarDaysIcon },
  { name: 'Bookings',   path: '/bookings',   icon: ListBulletIcon },
  { name: 'Settings',   path: '/settings',   icon: Cog6ToothIcon },
];

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 text-2xl font-bold text-primary border-b">Calendly-Clone</div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile block */}
        {user && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}`}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1 truncate">
                <p className="text-sm font-semibold">{user.name}</p>
                <button
                  onClick={logout}
                  className="text-xs text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}