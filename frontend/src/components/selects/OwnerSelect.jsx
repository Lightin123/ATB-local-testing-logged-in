import { useGetOwnersQuery } from '../../services/appApi';

export default function OwnerSelect({ value, onChange }) {
  const { data } = useGetOwnersQuery();
  const owners = data;

  return (
    <select value={value || ''} onChange={e => onChange(e.target.value ? Number(e.target.value) : '')} className="border p-1">
      <option value="">Select owner</option>
      {owners?.map(o => (
        <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
      ))}
    </select>
  );
}
