import React from 'react';
import MaintenanceList from './MaintenanceList.tsx';

interface Props {
  unitId?: number;
  onEdit?: (report: any) => void;
  onDelete?: (id: number) => void;
  [key: string]: any;
}

export default function Maintenance({ unitId, onEdit, onDelete, ...props }: Props) {
  return (
    <MaintenanceList unitId={unitId} onEdit={onEdit} onDelete={onDelete} {...props} />
  );
}
