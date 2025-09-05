// frontend/src/components/EventType/AvailabilityScheduler.jsx
import { useEffect, useState } from 'react';
import { dayjs } from '../../utils/dayjs';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PlusIcon } from '@heroicons/react/24/outline';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AvailabilityScheduler({ availability, setValue }) {
  const [rows, setRows] = useState(availability || []);

  useEffect(() => {
    setValue('availability', rows,{ shouldValidate: false });
  }, [rows]);

  const addSlot = dayIndex => {
    setRows([...rows, { dayOfWeek: dayIndex, startTime: '09:00', endTime: '17:00', timezone: 'UTC' }]);
  };

  const updateRow = (index, field, val) => {
    const copy = [...rows];
    copy[index][field] = val;
    setRows(copy);
  };

  const removeRow = index => setRows(rows.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Set your weekly availability. Drag to reorder.</p>
      {days.map((d, i) => (
        <div key={d} className="border rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{d}</span>
            <button type="button" onClick={() => addSlot(i)} className="text-blue-600 hover:underline flex items-center space-x-1">
              <PlusIcon className="h-4 w-4" /> <span>Add</span>
            </button>
          </div>
          {rows.filter(r => r.dayOfWeek === i).map((slot, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <input
                type="time"
                value={slot.startTime}
                onChange={e => updateRow(rows.indexOf(slot), 'startTime', e.target.value)}
                className="border rounded p-1"
              />
              <span>–</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={e => updateRow(rows.indexOf(slot), 'endTime', e.target.value)}
                className="border rounded p-1"
              />
              <button type="button" onClick={() => removeRow(rows.indexOf(slot))} className="text-red-600 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}