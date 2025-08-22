import React, { useMemo } from "react";
import './Table.css'
import {FileCsvIcon} from '@phosphor-icons/react'; 
import type { TableAction, GenericTableProps } from "../../types/TableTypes.ts";

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
  const summaryText = useMemo(() => {
    if (!rows || rows.length === 0) return `1 - ${perPage} de ${total ?? perPage * 3}`;
    return `1 - ${rows.length} de ${total ?? rows.length}`;
  }, [rows, perPage, total]);

  return (
    <section className={`generic-table ${className}`}>
      <div>      
        <div className="generic-table-header">
          <h2 className="generic-top-title">{title}</h2>
          <button className="btn--small" onClick={onGenerateCSV}>
            Gerar CSV
            <FileCsvIcon size={20} />
          </button>
        </div>
        <div className="generic-table-content">
          <table style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)}>
                    {col.label}
                  </th>
                ))}
                {actions.length > 0 && <th className="action-header">Ações</th>}
              </tr>
            </thead>

            <tbody>
              {rows.length === 0
                ? Array.from({ length: perPage }).map((_, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={String(col.key)}>
                          {col.placeholder ?? "-"}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td>
                          <div>
                            {actions.map((a) => (
                              <button key={a.key} title={a.label}>
                                {a.icon ?? a.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                : rows.map((r, rowIndex) => (
                    <tr key={(r as any).id ?? rowIndex}>
                      {columns.map((col) => (
                        <td key={String(col.key)}>
                          {col.render ? col.render(r) : (r as any)[col.key as keyof T]}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td>
                          <div className='generic-table-actions'>
                            {actions.map((a) => (
                              <button
                                key={a.key}
                                onClick={() => a.onClick && a.onClick(r)}
                                className={`icon-btn ${a.className ?? ""}`}
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
      </div>

      <div className="generic-table-footer">
        <div>
          <div>Registros por página: {total}</div>
        </div>
        <div>{summaryText}</div>
      </div>
    </section>
  );
}

export default Table;
