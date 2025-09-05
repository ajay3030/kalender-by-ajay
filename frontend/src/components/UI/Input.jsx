// frontend/src/components/UI/Input.jsx
export function Input({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input {...props} className={`w-full border rounded p-2 ${error ? 'border-red-500' : 'border-gray-300'}`} />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

