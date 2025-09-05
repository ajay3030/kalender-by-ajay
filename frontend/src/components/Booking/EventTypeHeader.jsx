// frontend/src/components/Booking/EventTypeHeader.js
import { useState, useEffect } from 'react';
import { publicBookingAPI } from '../../utils/publicBookingAPI';

export default function EventTypeHeader({ eventType }) {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const data = await publicBookingAPI.getPublicEventType(eventType.slug);
        setHost(data.userId);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchHost();
  }, [eventType]);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h1 className="text-2xl font-bold">{eventType.title}</h1>
      <p className="text-sm text-gray-600">{eventType.description}</p>
      <div className="flex items-center space-x-4">
        <img
          src={host.photo || 'https://ui-avatars.com/api/?name=' + host.name}
          alt={host.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{host.name}</p>
          <p className="text-sm text-gray-600">{host.company}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{eventType.duration} min</span>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{eventType.location.type}</span>
      </div>
    </div>
  );
}