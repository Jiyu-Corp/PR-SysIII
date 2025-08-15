// GenericTable.tsx
import React, { useMemo } from "react";
import './Table.css'

/**
 * Generic types you can also export from a central `types.ts` if you prefer
 */
export type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  placeholder?: string;
  render?: (row: T) => React.ReactNode;
};

export type TableAction<T> = {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: (row: T) => void;
};

export interface GenericTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
  rows: T[];                          // <-- here: 'rows' is the prop name your page uses
  actions?: TableAction<T>[];
  perPage?: number;
  total?: number | null;
  onGenerateCSV?: () => void;
  className?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  rows,
  actions = [],
  perPage = 5,
  total = null,
  onGenerateCSV,
  className = "",
}: GenericTableProps<T>) {
  const summaryText = useMemo(() => {
    if (!rows || rows.length === 0) return `1 - ${perPage} de ${total ?? perPage * 3}`;
    return `1 - ${rows.length} de ${total ?? rows.length}`;
  }, [rows, perPage, total]);

  return (
    <section className={`generic-table ${className}`}>
      <div className="overflow-x-auto">
          <button className="btn--small" onClick={onGenerateCSV}>
            Gerar CSV
          </button>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-sky-600 text-white text-left">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2">
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && <th className="px-4 py-2">Ações</th>}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0
              ? Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3">
                        {col.placeholder ?? "-"}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {actions.map((a) => (
                            <button key={a.key} className="p-1 border rounded" title={a.label}>
                              {a.icon ?? a.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              : rows.map((r, rowIndex) => (
                  <tr key={(r as any).id ?? rowIndex} className="border-b">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3">
                        {col.render ? col.render(r) : (r as any)[col.key as keyof T]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {actions.map((a) => (
                            <button
                              key={a.key}
                              onClick={() => a.onClick && a.onClick(r)}
                              className="icon-btn"
                              title={a.label}
                            >
                              {a.icon ?? a.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="generic-table-footer">
        <div className="flex items-center gap-3">
          <div>Registros por página: {perPage}</div>
        </div>
        <div>{summaryText}</div>
      </div>
    </section>
  );
}

export default Table;
