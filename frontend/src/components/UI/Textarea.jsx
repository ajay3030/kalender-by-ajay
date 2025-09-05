// frontend/src/components/UI/Textarea.jsx
export function Textarea({ label, maxLength, ...props }) {
  const value = props.value || '';
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <textarea {...props} className="w-full border rounded p-2" maxLength={maxLength} />
      {maxLength && <p className="text-xs text-gray-500 mt-1">{value.length}/{maxLength}</p>}
    </div>
  );
}