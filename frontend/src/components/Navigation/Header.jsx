// frontend/src/components/Navigation/Header.jsx
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <button onClick={onMenuClick} className="lg:hidden p-1 rounded hover:bg-gray-100">
        <Bars3Icon className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
    </header>
  );
}