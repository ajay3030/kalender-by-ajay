// frontend/src/components/UI/SearchBar.jsx
export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full md:w-64"
    />
  );
}