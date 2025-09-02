// frontend/src/components/Profile/AvatarUpload.jsx
import { useState } from 'react';
import { profileAPI } from '../../utils/profileAPI';
import toast from 'react-hot-toast';

export default function AvatarUpload({ current, onUploaded }) {
  const [preview, setPreview] = useState(current);
  const [uploading, setUploading] = useState(false);

  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      toast.error('Only JPG/PNG ≤ 2 MB allowed');
      return;
    }

    // preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // upload
    setUploading(true);
    const form = new FormData();
    form.append('avatar', file);
    try {
      const { profilePicture } = await profileAPI.uploadAvatar(form);
      onUploaded(profilePicture);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
      setPreview(current); // rollback on error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <img
        src={preview || `https://ui-avatars.com/api/?name=User`}
        alt="avatar"
        className="w-32 h-32 rounded-full object-cover border"
      />
      <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded text-sm">
        {uploading ? 'Uploading…' : 'Change Photo'}
        <input type="file" accept="image/png, image/jpeg" onChange={onSelectFile} className="hidden" />
      </label>
    </div>
  );
}