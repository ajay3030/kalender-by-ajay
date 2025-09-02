// frontend/src/pages/Profile.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { profileAPI } from '../utils/profileAPI';
import { useAuth } from '../hooks/useAuth';
import AvatarUpload from '../components/Profile/AvatarUpload';
import toast, { Toaster } from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: user || {}
  });

  useEffect(() => { reset(user); }, [user, reset]);

  const onSubmit = async data => {
    try {
      const updated = await profileAPI.updateProfile(data);
      setUser(updated);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Profile</h2>

        <AvatarUpload current={user?.profilePicture} onUploaded={url => setUser({ ...user, profilePicture: url })} />

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input {...register('name', { required: true })} className="w-full border rounded p-2" />
            {errors.name && <p className="text-sm text-red-500">Required</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input disabled value={user?.email} className="w-full border rounded p-2 bg-gray-100" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Company</label>
              <input {...register('company')} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input {...register('phone')} className="w-full border rounded p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Website</label>
            <input {...register('website')} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea {...register('bio')} rows={3} className="w-full border rounded p-2" />
          </div>

          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save</button>
        </form>

        {/* Password change */}
        <ChangePassword />
      </div>
    </>
  );
}

function ChangePassword() {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await profileAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed');
      reset();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Change Password</h3>
      <input {...register('currentPassword', { required: true })} type="password" placeholder="Current" className="w-full border rounded p-2" />
      <input {...register('newPassword', { required: true, minLength: 6 })} type="password" placeholder="New" className="w-full border rounded p-2" />
      <button className="bg-primary text-white px-4 py-2 rounded">Change</button>
    </form>
  );
}