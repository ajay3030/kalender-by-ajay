// frontend/src/pages/EditEventType.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventTypeAPI } from '../utils/eventTypeAPI';
import toast from 'react-hot-toast';
import BasicDetailsForm from '../components/EventType/BasicDetailsForm';
import LocationForm from '../components/EventType/LocationForm';
import AvailabilityScheduler from '../components/EventType/AvailabilityScheduler';
import AdvancedSettings from '../components/EventType/AdvancedSettings';

const steps = ['Basic', 'Location', 'Availability', 'Advanced'];

export default function EditEventType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState(null);

  useEffect(() => {
    const fetchEventType = async () => {
      try {
        const data = await eventTypeAPI.getEventTypeById(id);
        setEventType(data);
        setValue('title', data.title);
        setValue('slug', data.slug);
        setValue('duration', data.duration);
        setValue('description', data.description);
        setValue('color', data.color);
        setValue('eventType', data.eventType);
        setValue('location', data.location);
        setValue('availability', data.availability);
        setValue('bufferTimeBefore', data.bufferTimeBefore);
        setValue('bufferTimeAfter', data.bufferTimeAfter);
        setValue('maxBookingsPerDay', data.maxBookingsPerDay);
        setValue('customQuestions', data.customQuestions);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventType();
  }, [id, setValue]);

  const onSubmit = async data => {
    try {
      await eventTypeAPI.updateEventType(id, data);
      toast.success('Event type updated');
      navigate('/dashboard/event-types');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Edit Event Type</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {currentStep === 0 && <BasicDetailsForm register={register} errors={errors} watch={watch} setValue={setValue} />}
        {currentStep === 1 && <LocationForm register={register} watch={watch} setValue={setValue} />}
        {currentStep === 2 && <AvailabilityScheduler eventTypeId={id} availability={watch('availability')} setValue={setValue} />}
        {currentStep === 3 && <AdvancedSettings register={register} watch={watch} setValue={setValue} />}

        <div className="flex justify-between pt-4">
          <button type="button" onClick={prev} disabled={currentStep === 0} className="px-4 py-2 border rounded disabled:opacity-50">
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={e => { e.preventDefault(); next();}} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow">
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
}