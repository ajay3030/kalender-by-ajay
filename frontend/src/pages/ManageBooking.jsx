
// ### 6. Booking Management for Clients (`pages/ManageBooking.js`)


// frontend/src/pages/ManageBooking.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicBookingAPI } from '../utils/publicBookingAPI';

export default function ManageBooking() {
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

  const handleCancel = async () => {
    try {
      await publicBookingAPI.cancelBooking(id, booking.cancellationToken);
      alert('Booking cancelled successfully');
    } catch (e) {
      alert('Cancellation failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Booking</h1>
      <p>Booking ID: {booking._id}</p>
      <p>Event: {booking.eventTypeId.title}</p>
      <p>Date/Time: {booking.bookingDateTime}</p>
      <p>Client Name: {booking.clientName}</p>
      <p>Client Email: {booking.clientEmail}</p>
      <p>Client Phone: {booking.clientPhone}</p>
      <p>Notes: {booking.notes}</p>
      <button onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded shadow">
        Cancel Booking
      </button>
    </div>
  );
}