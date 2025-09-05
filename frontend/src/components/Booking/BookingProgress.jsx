// frontend/src/components/Booking/BookingProgress.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function BookingProgress({ step }) {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(step);

  useEffect(() => {
    // Update current step based on URL or other logic
    // For simplicity, we'll use the provided step prop
    setCurrentStep(step);
  }, [step]);

  const steps = ['Date', 'Time', 'Details', 'Confirmation'];

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="text-lg font-semibold">Booking Progress</h3>
      <div className="flex space-x-4">
        {steps.map((stepName, index) => (
          <div key={index} className="flex-1 flex items-center space-x-2">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                index < currentStep ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'
              }`}
            >
              {index + 1}
            </div>
            <div className="w-full border-t-2 border-gray-300" />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {steps.map((stepName, index) => (
          <div key={index} className="text-center">
            <p className="text-sm">{stepName}</p>
            {index === currentStep && (
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-blue-600 mx-auto"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}