// frontend/src/components/EventType/AdvancedSettings.jsx
export default function AdvancedSettings({ register }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Advanced</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Buffer before (min)</label>
          <input type="number" {...register('bufferTimeBefore')} min={0} max={60} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Buffer after (min)</label>
          <input type="number" {...register('bufferTimeAfter')} min={0} max={60} className="w-full border rounded p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Max bookings per day (0 = unlimited)</label>
        <input type="number" {...register('maxBookingsPerDay')} min={0} className="w-full border rounded p-2" />
      </div>
    </div>
  );
}