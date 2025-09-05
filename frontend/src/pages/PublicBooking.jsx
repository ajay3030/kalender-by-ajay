// frontend/src/pages/PublicBooking.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicBookingAPI } from '../utils/publicBookingAPI';
import EventTypeHeader from '../components/Booking/EventTypeHeader';
import DatePicker from '../components/Booking/DatePicker';
import TimeSlotPicker from '../components/Booking/TimeSlotPicker';
import BookingForm from '../components/Booking/BookingForm';
import BookingProgress from '../components/Booking/BookingProgress';

export default function PublicBooking() {
  const { slug } = useParams();
  const [eventType, setEventType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventType = async () => {
      try {
        const data = await publicBookingAPI.getPublicEventType(slug);
        setEventType(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchEventType();
  }, [slug]);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <EventTypeHeader eventType={eventType} />
      <BookingProgress step={1} />
      <DatePicker eventTypeId={eventType._id} />
      <TimeSlotPicker eventTypeId={eventType._id} date="2025-09-10" />
      <BookingForm eventTypeId={eventType._id} />
    </div>
  );
}