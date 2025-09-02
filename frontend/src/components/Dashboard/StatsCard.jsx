// frontend/src/components/Dashboard/StatsCard.jsx
export default function StatsCard({ icon: Icon, title, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg p-4 flex items-center space-x-4`}>
      <Icon className="h-8 w-8" />
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}