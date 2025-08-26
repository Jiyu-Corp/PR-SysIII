import React, { useState, useMemo } from 'react';
import { TablePagination } from '@mui/material';
import './Table.css';
import { FileCsvIcon } from '@phosphor-icons/react';
import type { GenericTableProps } from '../../types/TableTypes.ts';

function Table<T extends Record<string, any>>({
  title = "Título",
  columns,
  rows,
  actions = [],
  perPage = 5,
  total = null,
  onGenerateCSV,
  className = "",
}: GenericTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(perPage);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const summaryText = useMemo(() => {
    const start = page * rowsPerPage + 1;
    const end = Math.min((page + 1) * rowsPerPage, total ?? rows.length);
    return `${start} - ${end} de ${total ?? rows.length}`;
  }, [page, rowsPerPage, rows.length, total]);

  return (
    <section className={`generic-table ${className}`}>
      {/* Header and CSV button */}
      <div className="generic-table-header">
        <h2 className="generic-top-title">{title}</h2>
        <button className="btn--small" onClick={onGenerateCSV}>
          Gerar CSV
          <FileCsvIcon size={20} />
        </button>
      </div>

      <div className="generic-table-content">
        <table style={{ marginTop: 20 }}>
          
          <thead>
            <tr>
              {columns.map(col => <th key={String(col.key)}>{col.label}</th>)}
              {actions.length > 0 && <th className="action-header">Ações</th>}
            </tr>
          </thead>
          {/* Paginated rows */}
          <tbody>
            {paginatedRows.length === 0
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i}>
                    {columns.map(col => <td key={String(col.key)}>{col.placeholder ?? "-"}</td>)}
                    {actions.length > 0 && <td>...</td>}
                  </tr>
                ))
              : paginatedRows.map((r, rowIndex) => (
                  <tr key={(r as any).id ?? rowIndex}>
                    {columns.map(col => (
                      <td key={String(col.key)}>
                        {col.render ? col.render(r) : (r as any)[col.key as keyof T]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="generic-table-actions">
                        {actions.map(a => (
                          <button
                            key={a.key}
                            onClick={() => a.onClick?.(r)}
                            className={`icon-btn ${a.className ?? ""}`}
                            title={a.label}
                          >
                            {a.icon ?? a.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="generic-table-footer">
        <TablePagination
          component="div"
          count={total ?? rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[perPage, perPage * 2, perPage * 5]}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
        <div>{summaryText}</div>
      </div>
    </section>
  );
}

export default Table;
