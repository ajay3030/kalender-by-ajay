// frontend/src/components/EventType/EventTypeCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { eventTypeAPI } from '../../utils/eventTypeAPI';
import toast from 'react-hot-toast';
import {
  DocumentDuplicateIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function EventTypeCard({ eventType, onMutate }) {
  const [busy, setBusy] = useState(false);

  const copyLink = () => {
    console.log("link copying.....")
    const link = `${window.location.origin}/book/${eventType.slug}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied!');
  };

  const toggle = async () => {
    setBusy(true);
    try {
      const updated = await eventTypeAPI.toggleEventType(eventType._id);
      onMutate();
      toast.success(updated.isActive ? 'Activated' : 'De-activated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async () => {
    setBusy(true);
    try {
      await eventTypeAPI.duplicateEventType(eventType._id);
      onMutate();
      toast.success('Duplicated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteET = async () => {
    if (!confirm('Delete this event type?')) return;
    setBusy(true);
    try {
      await eventTypeAPI.deleteEventType(eventType._id);
      onMutate();
      toast.success('Deleted');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{eventType.title}</h3>
          <p className="text-sm text-gray-600">{eventType.duration} min</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            eventType.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {eventType.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2">{eventType.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={copyLink} className="text-gray-500 hover:text-gray-700">
            <ShareIcon className="h-5 w-5" />
          </button>
          <Link to={`/dashboard/event-types/edit/${eventType._id}`} className="text-gray-500 hover:text-gray-700">
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button onClick={duplicate} disabled={busy} className="text-gray-500 hover:text-gray-700 disabled:opacity-50">
            <DocumentDuplicateIcon className="h-5 w-5" />
          </button>
          <button onClick={toggle} disabled={busy} className="text-sm px-2 py-1 rounded border">
            {eventType.isActive ? 'Pause' : 'Activate'}
          </button>
          <button onClick={deleteET} disabled={busy} className="text-red-600 hover:underline text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}