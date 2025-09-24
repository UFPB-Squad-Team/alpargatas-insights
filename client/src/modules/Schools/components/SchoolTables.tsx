import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
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
import { School as SchoolProps } from '@/domain/entities/School/SchoolProps';

// A prop `columns` é opcional para permitir a customização pelo Simulador.
type SchoolsTableProps = {
  data: any[]; // Usamos `any[]` para ser compatível com os dados do ranking do simulador
  columns?: ColumnDef<any>[];
  onRowClick?: (rowData: any) => void;
};

// Estilos para os badges, com a paleta de cores refinada
const dependencyStyles: { [key: string]: string } = {
  Municipal: 'bg-amber-100 text-amber-800',
  Estadual: 'bg-orange-100 text-orange-800',
};
const locationStyles: { [key: string]: string } = {
  Urbana: 'bg-lime-100 text-lime-800',
  Rural: 'bg-yellow-100 text-yellow-800',
};

// Definição completa das colunas padrão da tabela de escolas
const defaultSchoolColumns: ColumnDef<SchoolProps>[] = [
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
];

export const SchoolsTable = ({
  data,
  columns: customColumns,
  onRowClick,
}: SchoolsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => customColumns || defaultSchoolColumns,
    [customColumns],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleRowClick = (rowData: any) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-sm text-left text-brand-text-secondary">
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
              key={row.id}
              className={`bg-white border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
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
