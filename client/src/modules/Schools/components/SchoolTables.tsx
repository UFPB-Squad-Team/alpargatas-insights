import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { School as SchoolProps } from '@/domain/entities/School/SchoolProps';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  LocateFixed,
  MapPin,
  School,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ScoreCell } from './ScoreCell';
import { SortableHeader } from './SortableHeader';

type SchoolsTableProps = {
  data: SchoolProps[];
  globalFilter: string;
};

const dependencyStyles: { [key: string]: string } = {
  Municipal: 'bg-amber-100 text-amber-800',
  Estadual: 'bg-orange-100 text-orange-800',
};
const locationStyles: { [key: string]: string } = {
  Urbana: 'bg-lime-100 text-lime-800',
  Rural: 'bg-yellow-100 text-yellow-800',
};

export const SchoolsTable = ({ data, globalFilter }: SchoolsTableProps) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<SchoolProps>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: ({ column }) => (
          <SortableHeader column={column} title="Escola" Icon={School} />
        ),
        cell: ({ row }) => (
          <div className="font-bold text-brand-text-primary">
            {row.original.nome}
          </div>
        ),
      },
      {
        accessorKey: 'municipio',
        header: ({ column }) => (
          <SortableHeader column={column} title="Município" Icon={Building} />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'scoreDeRisco',
        header: ({ column }) => (
          <SortableHeader
            column={column}
            title="Score de Risco"
            Icon={TrendingUp}
          />
        ),
        cell: ({ row }) => <ScoreCell score={row.original.scoreDeRisco} />,
      },
      {
        accessorKey: 'totalAlunos',
        header: ({ column }) => (
          <SortableHeader column={column} title="Alunos" Icon={Users} />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'dependenciaAdm',
        header: () => (
          <div className="flex items-center font-bold">
            <MapPin className="mr-2 h-4 w-4" />
            Dependência
          </div>
        ),
        cell: ({ row }) => {
          const dep = row.original.dependenciaAdm;
          const style = dependencyStyles[dep] || 'bg-gray-100 text-gray-800';
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${style}`}
            >
              {dep}
            </span>
          );
        },
      },
      {
        accessorKey: 'localizacaoTipo',
        header: () => (
          <div className="flex items-center font-bold">
            <LocateFixed className="mr-2 h-4 w-4" />
            Localização
          </div>
        ),
        cell: ({ row }) => {
          const loc = row.original.localizacaoTipo;
          const style = locationStyles[loc] || 'bg-gray-100 text-gray-800';
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${style}`}
            >
              {loc}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  const handleRowClick = (rowData: SchoolProps) => {
    const schoolId = rowData.id; // Usando o INEP como ID único e confiável.
    navigate(`/escolas/${schoolId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-brand-text-secondary">
        <thead className="text-xs text-brand-text-secondary uppercase bg-brand-surface">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.original.inep}
              className="bg-white border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
