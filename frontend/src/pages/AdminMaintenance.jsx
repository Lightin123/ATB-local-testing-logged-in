import { useSelector } from 'react-redux';
import { useUpdateMaintenanceReportMutation } from '../services/appApi';
import UnitSelect from '../components/selects/UnitSelect.jsx';
import OwnerSelect from '../components/selects/OwnerSelect.jsx';
import TenantSelect from '../components/selects/TenantSelect.jsx';
import TagMultiSelect from '../components/selects/TagMultiSelect.jsx';
import { MaintenanceStatusBadge } from '../utils/statusBadges.jsx';

export default function AdminMaintenance({ reports }) {
  const role = useSelector(s => s.authSlice.userInfo?.role);
  const editable = role === 'ADMIN';
  const [patch] = useUpdateMaintenanceReportMutation();

  const update = (id, patchObj) => patch({ id, ...patchObj });

  return (
    <table>
      <tbody>
        {reports.map(r => (
          <tr key={r.id}>
            {/* Creation Date (static) */}
            <td>{new Date(r.createdAt).toLocaleDateString()}</td>

            {/* Title */}
            <td>
              {editable
                ? <input
                    value={r.title}
                    onChange={e => update(r.id, { title: e.target.value })}
                  />
                : r.title}
            </td>

            {/* Status */}
            <td>
              {editable
                ? <select
                    value={r.status}
                    onChange={e => update(r.id, { status: e.target.value })}
                  >
                    {['OPEN','IN_PROGRESS','COMPLETED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                : <MaintenanceStatusBadge status={r.status}/>} 
            </td>

            {/* HOA */}
            <td>
              {editable
                ? <input
                    type="checkbox"
                    checked={r.pendingTagRequest}
                    onChange={e => update(r.id, { pendingTagRequest: e.target.checked })}
                  />
                : (r.pendingTagRequest ? 'Yes' : 'No')}
            </td>

            {/* Unit */}
            <td>
              {editable
                ? <UnitSelect
                    value={r.unit?.id || ''}
                    onChange={unitId => update(r.id, { unitId })}
                  />
                : r.unit
                  ? `${r.unit.property.address}, Unit ${r.unit.unitNumber}`
                  : '—'}
            </td>

            {/* Owner */}
            <td>
              {editable
                ? <OwnerSelect
                    value={r.owner?.id || ''}
                    onChange={ownerId => update(r.id, { ownerId })}
                  />
                : `${r.owner?.user?.firstName || ''} ${r.owner?.user?.lastName || ''}`.trim() || '—'}
            </td>

            {/* Tenant */}
            <td>
              {editable
                ? <TenantSelect
                    value={r.reporter?.id || ''}
                    onChange={reporterId => update(r.id, { reporterId })}
                  />
                : `${r.reporter?.user?.firstName || ''} ${r.reporter?.user?.lastName || ''}`.trim() || '—'}
            </td>

            {/* Tags */}
            <td>
              {editable
                ? <TagMultiSelect
                    values={r.tags.map(t => t.id)}
                    onChange={tags => update(r.id, { tags })}
                  />
                : r.tags.map(t => t.name).join(', ') || '—'}
            </td>

            {/* Category */}
            <td>
              {editable
                ? <input
                    value={r.category}
                    onChange={e => update(r.id, { category: e.target.value })}
                  />
                : r.category}
            </td>

            {/* Priority */}
            <td>
              {editable
                ? <select
                    value={r.priority}
                    onChange={e => update(r.id, { priority: e.target.value })}
                  >
                    {['LOW','MEDIUM','HIGH'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                : r.priority}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
