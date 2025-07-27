import { useGetUnitsQuery } from '../../services/appApi';

export default function UnitSelect({ value, onChange }) {
  const { data } = useGetUnitsQuery();
  const units = data;

  return (
    <select value={value || ''} onChange={e => onChange(e.target.value ? Number(e.target.value) : '')} className="border p-1">
      <option value="">Select unit</option>
      {units?.map(u => (
        <option key={u.id} value={u.id}>{u.unitIdentifier || `Unit ${u.id}`}</option>
      ))}
    </select>
  );
}
