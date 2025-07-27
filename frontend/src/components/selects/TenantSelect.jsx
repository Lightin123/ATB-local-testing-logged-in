import { useGetTenantsQuery } from '../../services/appApi';

export default function TenantSelect({ value, onChange }) {
  const { data } = useGetTenantsQuery();
  const tenants = data;

  return (
    <select value={value || ''} onChange={e => onChange(e.target.value ? Number(e.target.value) : '')} className="border p-1">
      <option value="">Select tenant</option>
      {tenants?.map(t => (
        <option key={t.id} value={t.id}>{t?.user ? `${t.user?.firstName} ${t.user?.lastName}` : t.firstName + ' ' + t.lastName}</option>
      ))}
    </select>
  );
}
