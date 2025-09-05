// frontend/src/components/EventType/LocationForm.jsx
export default function LocationForm({ register, watch, setValue }) {
  const type = watch('location.type');
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Location</label>
      <select {...register('location.type')} className="w-full border rounded p-2">
        <option value="zoom">Zoom</option>
        <option value="google-meet">Google Meet</option>
        <option value="phone">Phone</option>
        <option value="in-person">In-person</option>
        <option value="custom">Custom</option>
      </select>
      {type === 'custom' && (
        <input {...register('location.value')} placeholder="Enter address or link" className="w-full border rounded p-2" />
      )}
    </div>
  );
}