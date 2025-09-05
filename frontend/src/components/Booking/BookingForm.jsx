// frontend/src/components/Booking/BookingForm.js
import { useForm } from 'react-hook-form';
import { publicBookingAPI } from '../../utils/publicBookingAPI';
import { useTimezone } from '../../hooks/useTimezone';

export default function BookingForm({ eventTypeId }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { clientTimezone } = useTimezone();

  const onSubmit = async (data) => {
    try {
      await publicBookingAPI.createBooking({
        ...data,
        eventTypeId,
        clientTimezone,
      });
      alert('Booking created successfully!');
    } catch (e) {
      alert('Booking failed: ' + e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold">Client Information</h3>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register('clientName', { required: true })} className="w-full border rounded p-2" />
        {errors.clientName && <p className="text-sm text-red-500">Name is required</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register('clientEmail', { required: true })} className="w-full border rounded p-2" />
        {errors.clientEmail && <p className="text-sm text-red-500">Valid email is required</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input type="tel" {...register('clientPhone')} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea {...register('notes')} className="w-full border rounded p-2" rows={4} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
        Submit
      </button>
    </form>
  );
}