import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUnitQuery } from '../services/appApi';
import MaintenanceList from '../components/maintenance/MaintenanceList';

export default function UnitDetails() {
  const { propertyId, unitId } = useParams();
  const { data: unit, isLoading: uLoading } = useGetUnitQuery(unitId, { skip: !unitId });
  if (uLoading) return <div>Loading…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">
        Unit {unit.unitNumber} — {unit.status}
      </h2>
      <div className="mt-4 space-y-2">
        <p><strong>Floor:</strong> {unit.floor}</p>
        <p><strong>Size:</strong> {unit.unitSize} sqft</p>
        <p><strong>Rent:</strong> ${unit.rentalPrice}</p>
        <p>
          <strong>Owner:</strong>{' '}
          {unit.owners?.map(o => `${o.firstName} ${o.lastName}`).join(', ')}
        </p>
        <p>
          <strong>Tenant:</strong>{' '}
          {unit.tenant
            ? `${unit.tenant.firstName} ${unit.tenant.lastName}`
            : 'Vacant'}
        </p>
      </div>

      <h3 className="mt-8 text-xl font-medium">Maintenance Requests</h3>
      <MaintenanceList unitId={unitId} />
    </div>
  );
}
