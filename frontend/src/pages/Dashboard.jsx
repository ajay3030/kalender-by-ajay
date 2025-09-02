// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { dashboardAPI } from '../utils/dashboardAPI';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentBookings from '../components/Dashboard/RecentBookings';
import { CalendarDaysIcon, ListBulletIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading stats…</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome back!</h2>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          icon={CalendarDaysIcon}
          title="Total Events"
          value={stats.totalEvents || 0}
          color="bg-blue-500"
        />
        <StatsCard
          icon={ListBulletIcon}
          title="Total Bookings"
          value={stats.totalBookings || 0}
          color="bg-green-500"
        />
        <StatsCard
          icon={UserGroupIcon}
          title="Upcoming"
          value={stats.upcoming || 0}
          color="bg-purple-500"
        />
      </div>

      {/* Recent & Upcoming */}
      <RecentBookings bookings={stats.recent} />
    </div>
  );
}