// frontend/src/pages/Settings.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { profileAPI } from '../utils/profileAPI';
import { useAuth } from '../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

const timezones = Intl.supportedValuesOf('timeZone');

export default function Settings() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: user?.preferences || {}
  });

  useEffect(() => {
    profileAPI.getSettings().then(reset);
  }, []);

  const onSubmit = async data => {
    try {
      await profileAPI.updateSettings(data);
      setUser({ ...user, preferences: data });
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Settings</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Account */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Account</h3>
            <div>
              <label className="block text-sm font-medium">Language</label>
              <select {...register('language')} className="w-full border rounded p-2">
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('notifications.email')} />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('notifications.sms')} />
              <span>SMS notifications</span>
            </label>
          </section>

          {/* Timezone */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Timezone</h3>
            <select {...register('timezone')} className="w-full border rounded p-2">
              {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </section>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md"> Save Settings</button>        </form>
      </div>
    </>
  );
}