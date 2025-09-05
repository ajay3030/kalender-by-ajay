// frontend/src/pages/CreateEventType.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventTypeAPI } from '../utils/eventTypeAPI';
import toast from 'react-hot-toast';
import BasicDetailsForm from '../components/EventType/BasicDetailsForm';
import LocationForm from '../components/EventType/LocationForm';
import AvailabilityScheduler from '../components/EventType/AvailabilityScheduler';
import AdvancedSettings from '../components/EventType/AdvancedSettings';

const steps = ['Basic', 'Location', 'Availability', 'Advanced'];

export default function CreateEventType() {
  const { register, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      duration: 30,
      description: '',
      color: '#3B82F6',
      eventType: 'one-on-one',
      location: { type: 'zoom', value: '' },
      availability: [],
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
      maxBookingsPerDay: 0,
      customQuestions: [],
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async data => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await eventTypeAPI.createEventType(data);
      toast.success('Event type created');
      navigate('/dashboard/event-types');
    } catch (e) {
      toast.error(e.message);
      setSubmitting(false);
    }
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">New Event Type</h2>

      {/* Stepper */}
      <div className="flex items-center space-x-4">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center space-x-2 ${i <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="w-6 h-6 rounded-full border flex items-center justify-center">{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {currentStep === 0 && <BasicDetailsForm register={register} errors={errors} watch={watch} setValue={setValue} />}
        {currentStep === 1 && <LocationForm register={register} watch={watch} setValue={setValue} />}
        {currentStep === 2 && <AvailabilityScheduler eventTypeId={null} availability={watch('availability')} setValue={setValue} />}
        {currentStep === 3 && <AdvancedSettings register={register} watch={watch} setValue={setValue} />}

        <div className="flex justify-between pt-4">
          <button type="button" onClick={prev} disabled={currentStep === 0} className="px-4 py-2 border rounded disabled:opacity-50">
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={e => { e.preventDefault(); next(); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
              Next
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow">
              {submitting ? 'Creating…' : 'Create'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}