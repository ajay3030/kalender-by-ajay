// frontend/src/components/EventType/BasicDetailsForm.jsx
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';

export default function BasicDetailsForm({ register, errors, watch, setValue }) {
  const title = watch('title');
  const slug = watch('slug');
  return (
    <div className="space-y-4">
      <Input label="Event name *" {...register('title', { required: true })} error={errors.title} />
      <div>
        <label className="block text-sm font-medium">Slug (URL)</label>
        <input
          {...register('slug')}
          placeholder={title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-event'}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Duration (minutes)</label>
        <select {...register('duration')} className="w-full border rounded p-2">
          {[15, 30, 45, 60, 90, 120].map(d => (
            <option key={d} value={d}>{d} min</option>
          ))}
        </select>
      </div>
      <Textarea label="Description" {...register('description')} maxLength={500} />
      <div>
        <label className="block text-sm font-medium">Color</label>
        <input type="color" {...register('color')} className="w-16 h-8" />
      </div>
      <div>
        <label className="block text-sm font-medium">Event Type</label>
        <select {...register('eventType')} className="w-full border rounded p-2">
          <option value="one-on-one">One-on-One</option>
          <option value="group">Group</option>
          <option value="round-robin">Round Robin</option>
        </select>
      </div>
    </div>
  );
}