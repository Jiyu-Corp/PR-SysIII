import React, { useState, useMemo, useEffect } from 'react';
import { TablePagination, Switch } from '@mui/material';
import './Table.css';
import { ArticleIcon, FileCsvIcon } from '@phosphor-icons/react';
import type { GenericTableProps } from '../../types/TableTypes.ts';

function Table<T extends Record<string, any>>({
  title = "Título",
  columns,
  rows,
  actions = [],
  perPage = 10,
  total = null,
  onGenerateCSV,
  className = "",
  isReport
}: GenericTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(perPage);

  const [switchState, setSwitchState] = useState<Record<string, boolean>>({});

  const getRowId = (r: T, rowIndex: number) => (r as any).id ?? `row-${rowIndex}`;
  const makeSwitchKey = (colKey: string | number, rowId: string) => `${String(colKey)}@@${rowId}`;

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const col of columns) {
      if ((col as any).type === 'switch') {
        rows.forEach((r, idx) => {
          const rowId = getRowId(r, idx);
          const sk = makeSwitchKey(String(col.key), rowId);
          if (!(sk in switchState)) {
            next[sk] = Boolean((r as any)[col.key]);
          }
        });
      }
    }
    if (Object.keys(next).length) setSwitchState(prev => ({ ...prev, ...next }));
  }, [rows, columns]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const summaryText = useMemo(() => {
    const start = page * rowsPerPage + 1;
    const end = Math.min((page + 1) * rowsPerPage, total ?? rows.length);
    return `${start} - ${end} de ${total ?? rows.length}`;
  }, [page, rowsPerPage, rows.length, total]);

  const handleSwitchChange =
    (col: any, row: T, rowId: string) => async (
      _event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean
    ) => {
      const sk = makeSwitchKey(col.key, rowId);

      const canCheck = await col.onToggle?.(row, checked);
      if (!canCheck) return;

      if (!col.controlled) {
        setSwitchState(prev => {
          if (checked) {
            const updated: Record<string, boolean> = {};
            Object.keys(prev).forEach(k => (updated[k] = false));
            updated[sk] = true;
            return updated;
          } else {
            return { ...prev, [sk]: false };
          }
        });
      }
    };


  return (
    <section className={`generic-table ${className}`}>
      <div className="generic-table-header">
        <h2 className="generic-top-title">{title}</h2>
        <button className="btn--small" onClick={onGenerateCSV}>
          Gerar {`${isReport ? "Relatório" : "CSV"}`}
          {isReport
            ? <ArticleIcon size={20}/> 
            : <FileCsvIcon size={20} />
          }
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

          <tbody>
            {paginatedRows.length === 0
              ? (
                <tr className="empty-row">
                  <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhum dado disponível
                  </td>
                </tr>
              )
              : paginatedRows.map((r, rowIndex) => {
                const rowId = getRowId(r, rowIndex);
                return (
                  <tr key={(r as any).id ?? rowIndex}>
                    {columns.map(col => {
                      if (col.render) {
                        return <td key={String(col.key)}>{col.render(r)}</td>;
                      }

                      if ((col as any).type === 'switch') {
                        const sk = makeSwitchKey(String(col.key), rowId);
                        const controlled = Boolean(col.controlled);
                        const valueFromRow = Boolean((r as any)[col.key]);

                        const extraProps = typeof (col as any).switchProps === 'function'
                          ? (col as any).switchProps(r)
                          : (col as any).switchProps ?? {};

                        return (
                          <td key={String(col.key)}>
                            <Switch
                              checked={Boolean(switchState[sk])}
                              onChange={handleSwitchChange(col, r, rowId)}
                              {...extraProps}
                            />
                          </td>
                        );
                      }

                      return <td key={String(col.key)}>{(r as any)[col.key as keyof T]}</td>;
                    })}
                    {actions.length > 0 && (
                      <td className="generic-table-actions">
                        {actions.map(a => {
                          const isDisabled = typeof a.isDisabled === 'function' ? a.isDisabled(r) : false;
                          console.log(r);
                          return (
                            <button
                              key={a.key}
                              onClick={() => a.onClick?.(r)}
                              className={`icon-btn ${a.className ?? ""} ${isDisabled ? "action-disabled" : ""}`}
                              title={a.label}
                              disabled={isDisabled}
                            >
                              {a.icon ?? a.label}
                            </button>
                          )
                        })}
                      </td>
                    )}
                  </tr>
                );
              })}
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
