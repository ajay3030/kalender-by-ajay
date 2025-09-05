// frontend/src/pages/BookingConfirmation.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicBookingAPI } from '../utils/publicBookingAPI';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await publicBookingAPI.getBookingDetails(id);
        setBooking(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!booking) return <p>Booking not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Booking Confirmation</h1>
      <p><strong>Booking ID:</strong> {booking._id}</p>
      <p><strong>Event:</strong> {booking.eventTypeId?.title}</p>
      <p><strong>Date/Time:</strong> {booking.bookingDateTime}</p>
      <p><strong>Client Name:</strong> {booking.clientName}</p>
      <p><strong>Client Email:</strong> {booking.clientEmail}</p>
      <p><strong>Client Phone:</strong> {booking.clientPhone}</p>
      <p><strong>Notes:</strong> {booking.notes || 'N/A'}</p>

      <a
        href={`/booking/${booking._id}/cancel?token=${booking.cancellationToken}`}
        className="inline-block bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
      >
        Cancel Booking
      </a>
    </div>
  );
}
