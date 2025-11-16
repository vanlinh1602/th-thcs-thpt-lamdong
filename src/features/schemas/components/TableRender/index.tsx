import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber, parseNumber } from '@/lib/common';

import { ReportField, TableConfig } from '../../type';

// ---- Utilities ----
function initMatrix(config: TableConfig) {
  // returns a mutable data table: one object per row
  return config.rows.map((r) => {
    const row: Record<string, any> = { key: r.key };
    for (const c of config.cols) row[c.key] = '';
    return row;
  });
}

type Props = {
  field: ReportField<'table'>;
  value: Record<string, any>;
  onChange: (path: string, value: any) => void;
};

// ---- Editable Table Component ----
export const TableRender = ({ value, field, onChange }: Props) => {
  const { config } = field;
  const [rowsData, setRowsData] = useState<any[]>([]);

  useEffect(() => {
    if (!value) {
      const initValue = initMatrix(config);
      setRowsData(initValue);
      onChange(
        field.key,
        initValue.reduce((acc, row) => {
          const { key, ...rest } = row;
          acc[key] = rest;
          return acc;
        }, {})
      );
    } else {
      setRowsData(
        Object.entries(value).map(([key, row]: [string, any]) => ({
          key,
          ...row,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, config]);

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    const cols: ColumnDef<Record<string, any>>[] = [];

    // Sticky row title column
    cols.push({
      id: 'name',
      header: () => (
        <span className="whitespace-nowrap">{config.title || ''}</span>
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap font-medium">
          {config.rows.find((r) => r.key === row.original.key)?.name}
        </div>
      ),
    });

    for (const c of config.cols) {
      cols.push({
        id: c.key,
        accessorKey: c.key,
        header: () => (
          <span className="whitespace-nowrap text-center w-full">{c.name}</span>
        ),
        cell: ({ row, getValue }) => (
          <Input
            type="text"
            inputMode="numeric"
            className="h-8 min-w-20"
            value={
              c.type === 'number'
                ? formatNumber(String(getValue<string>() ?? ''))
                : String(getValue<string>() ?? '')
            }
            onChange={(e) => {
              let v: any = e.target.value || '';
              if (c.type === 'number') {
                v = parseNumber(v) || '';
              }
              onChange(`${field.key}.${row.original.key}.${c.key}`, v);
            }}
            onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()} // avoid wheel changing while scrolling
          />
        ),
      });
    }

    // // Optional sum column
    // cols.push({
    //   id: '__sum',
    //   header: () => <span className="whitespace-nowrap">Tổng</span>,
    //   cell: ({ row }) => {
    //     const original = row.original;
    //     const total = config.cols.reduce(
    //       (acc, c) => acc + Number(original[c.key] ?? 0),
    //       0
    //     );
    //     return (
    //       <div className="text-right tabular-nums font-medium">{total}</div>
    //     );
    //   },
    //   size: 120,
    // });

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const table = useReactTable({
    data: rowsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  return (
    <div>
      <div className="font-medium text-foreground">{field.name}</div>
      <div className="rounded-md border mt-2 w-full col-span-2">
        <UITable className="b-2">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((r) => (
              <TableRow key={r.id}>
                {r.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.id === '__sum' ? 'text-right' : ''}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </div>
    </div>
  );
};
