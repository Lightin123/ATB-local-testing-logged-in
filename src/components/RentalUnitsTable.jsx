import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataTable } from './ui/data-table.js';
import { ListingStatusBadge } from '../utils/statusBadges.js';
import { dateParser, moneyParser } from '../utils/formatters.js';
import AppLink from './general/Link.tsx';
import EditRentalUnit from './rentals/EditRentalUnit';
import { Button } from './ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu.tsx';
import { Building2, MoreHorizontal, Pencil } from 'lucide-react';

const RentalTableDropdown = ({ unit }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu>
      <EditRentalUnit unit={unit} open={open} setOpen={() => setOpen(!open)} />
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/properties/${unit.realEstateObjectId}`)}>
          <Building2 className="h-4 w-4 mr-2" />
          View Property
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const buildColumns = (showPropertyColumn, setEditingOwner) => {
  const columns = [
    {
      id: 'unit',
      header: 'Unit Identifier',
      cell: ({ row }) => <AppLink id={row.original.id} type="unit" />,
      meta: { type: 'string' },
      accessorFn: row => row.unitIdentifier,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'unitNumber',
      header: 'Unit Number',
      enableSorting: true,
      cell: ({ row }) => row.original.unitNumber || row.original.number || '—',
      meta: { type: 'string' },
      accessorFn: row => row.unitNumber || row.number || '',
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: ({ row }) => {
        const owner = row.original.owner || row.original.owners?.[0];
        if (!owner) return '—';
        return (
          <span
            onClick={() => setEditingOwner && setEditingOwner(owner)}
            className="cursor-pointer hover:underline"
          >
            {owner.firstName} {owner.lastName}
          </span>
        );
      },
      meta: { type: 'string' },
      accessorFn: row => {
        const owner = row.owner || row.owners?.[0];
        return owner ? `${owner.firstName} ${owner.lastName}` : '';
      },
    },
    {
      id: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => <ListingStatusBadge status={row.original.status} />,
      meta: { type: 'string' },
      accessorFn: row => row.status,
    },
    {
      id: 'tenant',
      header: 'Current Tenant',
      enableSorting: true,
      cell: ({ row }) => {
        const t = row.original.tenant;
        if (t?.user) {
          return `${t.user.firstName} ${t.user.lastName}`;
        }
        if (t?.firstName) {
          return `${t.firstName} ${t.lastName}`;
        }
        return 'No Tenant';
      },
      meta: { type: 'string' },
      accessorFn: row => {
        const t = row.tenant;
        if (t?.user) return `${t.user.firstName} ${t.user.lastName}`;
        if (t?.firstName) return `${t.firstName} ${t.lastName}`;
        return '';
      },
    },
    {
      id: 'serviceRequests',
      header: 'Service Requests',
      cell: ({ row }) => {
        const count = (row.original?.maintenanceRequests?.length) || 0;
        return (
          <Link to="/service-requests">
            {count} request{count !== 1 ? 's' : ''}
          </Link>
        );
      },
      accessorFn: row =>
        (row.maintenanceRequests?.length?.toString()) || '0',
      enableSorting: false,
    },
    {
      id: 'leaseStartDate',
      header: 'Lease Start Date',
      enableSorting: true,
      cell: ({ row }) => {
        const lease = row.original.leases?.[0];
        return lease?.startDate ? <div>{dateParser(lease.startDate)}</div> : '';
      },
      meta: { type: 'date' },
      accessorFn: row => row.leases?.[0]?.startDate || undefined,
    },
    {
      id: 'leaseEndDate',
      header: 'Lease End Date',
      enableSorting: true,
      cell: ({ row }) => {
        const lease = row.original.leases?.[0];
        return lease?.endDate ? <div>{dateParser(lease.endDate)}</div> : '';
      },
      meta: { type: 'date' },
      accessorFn: row => row.leases?.[0]?.endDate || undefined,
    },
    {
      id: 'monthlyRent',
      header: 'Monthly Rent',
      enableSorting: true,
      cell: ({ row }) => <div>{moneyParser(row.original.rentalPrice)}</div>,
      meta: { type: 'number' },
      accessorFn: row => row.rentalPrice || undefined,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <RentalTableDropdown unit={row.original} />,
    },
  ];

  if (showPropertyColumn) {
    columns.splice(2, 0, {
      id: 'property',
      enableSorting: true,
      header: 'Property',
      meta: { type: 'string' },
      cell: ({ row }) => {
        const property = row.original.realEstateObject || row.original.property;
        return <div className="capitalize font-400">{property?.title || property?.name}</div>;
      },
      accessorFn: row => row.realEstateObject?.title || row.property?.name,
    });
  }

  return columns;
};

const RentalUnitsTable = ({ units, showPropertyColumn = true, setEditingOwner }) => {
  const columns = React.useMemo(() => buildColumns(showPropertyColumn, setEditingOwner), [showPropertyColumn, setEditingOwner]);
  return <DataTable data={units} columns={columns} />;
};

export default RentalUnitsTable;
