// frontend/src/pages/EventTypes.jsx
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useEventTypes } from '../context/EventTypeContext';
import EventTypeCard from '../components/EventType/EventTypeCard';
import SearchBar from '../components/UI/SearchBar';
import { useLocation } from 'react-router-dom';

export default function EventTypes() {
  const { list, loading, filter, setFilter, refetch } = useEventTypes();
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
   refetch();               // fresh data every time we enter this page
 }, [location.pathname]);

  const filtered = list.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Types</h1>
        <Link
          to="/dashboard/event-types/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Event Type</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search event types…" />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(et => (
          <EventTypeCard key={et._id} eventType={et} onMutate={refetch} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center">No event types found.</p>
      )}
    </div>
  );
}