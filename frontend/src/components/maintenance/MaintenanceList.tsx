import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useGetMaintenanceQuery } from '../../services/appApi';
import { MaintenanceStatus, Priority } from '../../utils/magicNumbers.jsx';
import { dateParser } from '../../utils/formatters';
import { MaintenanceStatusBadge, PriorityBadge } from '../../utils/statusBadges';
import { DataTable } from '../ui/data-table.jsx';
import Link from '../general/Link.tsx';
import { Badge } from '../ui/badge.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/button.tsx';
import { MoreHorizontal } from 'lucide-react';
import { MaintenanceRequest } from '../../utils/classes.ts';

interface Props {
  unitId?: number;
  onEdit?: (report: MaintenanceRequest) => void;
  onDelete?: (id: number) => void;
}

export default function MaintenanceList({ unitId, onEdit, onDelete }: Props) {
  const { data: reports = [], isLoading, isError, error } = useGetMaintenanceQuery(unitId);

  const columns: ColumnDef<MaintenanceRequest>[] = useMemo(() => {
    const base: ColumnDef<MaintenanceRequest>[] = [
      {
        id: 'createdAt',
        header: 'Creation Date',
        cell: ({ row }) => <div className="capitalize">{dateParser((row.original as any).createdAt)}</div>,
        accessorFn: row => new Date((row as any).createdAt) || '',
        meta: { type: 'date' },
        enableSorting: true,
      },
      {
        id: 'title',
        header: 'Title',
        cell: ({ row }) => <div className="capitalize">{(row.original as any).title}</div>,
        accessorFn: row => (row as any).title || '',
        meta: { type: 'string' },
        enableSorting: true,
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <MaintenanceStatusBadge status={(row.original as any).status} />,
        accessorFn: row => (row as any).status,
        meta: { type: 'enum', options: Object.values(MaintenanceStatus) },
        enableSorting: true,
      },
      {
        id: 'priority',
        header: 'Priority',
        cell: ({ row }) => <PriorityBadge priority={(row.original as any).priority} />,
        accessorFn: row => (row as any).priority,
        meta: { type: 'enum', options: Object.values(Priority) },
        enableSorting: true,
      },
      {
        id: 'hoa',
        header: 'HOA',
        cell: ({ row }) => {
          const r: any = row.original;
          if (r.isHOAIssue) return <Badge variant="blue">HOA Issue</Badge>;
          if (r.pendingTagRequest) return <Badge variant="warning">HOA Review</Badge>;
          return null;
        },
        accessorFn: (row: any) => (row.isHOAIssue ? 'issue' : row.pendingTagRequest ? 'pending' : ''),
        enableSorting: false,
      },
      {
        id: 'unit',
        header: 'Unit',
        cell: ({ row }) => {
          const unit = (row.original as any).unit;
          if (!unit) return <p className="text-red-600/90">No Unit</p>;
          return <Link id={unit.id} type="unit" />;
        },
        accessorFn: (row: any) => {
          const u = row.unit;
          if (!u) return '';
          const addr = [u.realEstateObject?.street, u.realEstateObject?.city, u.realEstateObject?.state, u.realEstateObject?.zip]
            .filter(Boolean)
            .join(', ');
          return `${u.unitIdentifier || ''} ${addr}`.trim();
        },
        enableSorting: true,
        enableGlobalFilter: true,
        filterFn: 'includesString',
      },
      {
        id: 'owner',
        header: 'Owner',
        accessorFn: (report: any) => {
          const owners = report.unit?.owners || [];
          return owners.map((o: any) => `${o.firstName} ${o.lastName}`).join(', ');
        },
        cell: ({ row }) => {
          const owners: any[] = (row.original as any).unit?.owners || [];
          return owners.map(o => `${o.firstName} ${o.lastName}`).join(', ');
        },
        enableSorting: false,
      },
      {
        id: 'tenant',
        header: 'Tenant',
        cell: ({ row }) => {
          const tenantUser: any = (row.original as any).unit?.tenant?.user;
          return tenantUser ? `${tenantUser.firstName} ${tenantUser.lastName}` : '';
        },
        accessorFn: (row: any) => {
          const tenantUser = row.unit?.tenant?.user;
          return tenantUser ? `${tenantUser.firstName} ${tenantUser.lastName}` : '';
        },
        enableSorting: false,
      },
      {
        id: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const tags = (row.original as any).tags;
          return tags && tags.length > 0 ? tags.join(', ') : '';
        },
        accessorFn: (row: any) => (row.tags && row.tags.length > 0 ? row.tags.join(', ') : ''),
        enableSorting: false,
      },
      {
        id: 'category',
        header: 'Category',
        cell: ({ row }) => <div className="capitalize">{(row.original as any).category}</div>,
        accessorFn: (row: any) => row.category || '',
        meta: { type: 'string' },
        enableSorting: true,
      },
    ];

    return [
      ...base,
      {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete((row.original as any).id)}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, [onEdit, onDelete]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{(error as any)?.data?.message || 'Error'}</div>;

  return (
    <DataTable
      data={reports}
      columns={columns}
      defaultSort={{ id: 'createdAt', desc: true }}
      title="Maintenance Reports"
      subtitle="All maintenance reports for your properties."
    />
  );
}
