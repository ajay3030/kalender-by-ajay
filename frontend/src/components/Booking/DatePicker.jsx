// frontend/src/components/Booking/DatePicker.js
import { useState, useEffect } from 'react';
import { publicBookingAPI } from '../../utils/publicBookingAPI';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // for English locale
import 'dayjs/plugin/utc';
import 'dayjs/plugin/timezone';
import Calendar from 'react-calendar';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.locale('en');
dayjs.extend(utc);
dayjs.extend(timezone);

export default function DatePicker({ eventTypeId }) {
  const [value, onChange] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoading(true);
      try {
        const { startDate, endDate } = getMonthRange(value);
        const slots = await publicBookingAPI.getAvailableSlots(eventTypeId, startDate, endDate);
        setAvailableDates(slots);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, [eventTypeId, value]);

  const getMonthRange = (date) => {
    const start = dayjs(date).startOf('month').toISOString();
    const end = dayjs(date).endOf('month').toISOString();
    return { startDate: start, endDate: end };
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = dayjs(date).format('YYYY-MM-DD');
      return availableDates[dateStr] ? 'bg-green-100' : 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a Date</h3>
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        minDate={new Date()}
      />
      {loading && <p>Loading availability…</p>}
    </div>
  );
}