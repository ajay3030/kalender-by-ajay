// frontend/src/components/Booking/TimeSlotPicker.js
import { useState, useEffect } from 'react';
import { publicBookingAPI } from '../../utils/publicBookingAPI';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // for English locale
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.locale('en');
dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeSlotPicker({ eventTypeId, date }) {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await publicBookingAPI.getAvailableSlots(eventTypeId, date);
        setSlots(data[date] || []);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch available slots');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();

    // Set up interval to refresh slots every 30 seconds
    intervalId = setInterval(fetchSlots, 30000);

    // Clean up interval on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [eventTypeId, date]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a Time</h3>
      {loading ? (
        <p>Loading slots…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {slots.map((slot, idx) => (
            <li key={idx} className="bg-white rounded-lg shadow p-4">
              <p>{slot.start} - {slot.end}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}