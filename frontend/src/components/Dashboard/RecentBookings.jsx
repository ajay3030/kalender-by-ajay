// frontend/src/components/Dashboard/RecentBookings.jsx
import { format } from 'date-fns';

export default function RecentBookings({ bookings = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Recent Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Client</th>
              <th className="text-left py-2">Event</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b">
                <td className="py-2">{b.clientName}</td>
                <td className="py-2">{b.eventTypeId?.title}</td>
                <td className="py-2">{format(new Date(b.dateTime), 'PPp')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}