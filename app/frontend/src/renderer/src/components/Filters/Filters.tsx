// GenericFilters.tsx
import React, { useState } from "react";
import './Filters.css'
import {MagnifyingGlassIcon} from '@phosphor-icons/react';

export type FilterOption = { value: string; label: string };
export type FilterField = {
  key: string;
  label?: string;
  type?: "text" | "number" | "date" | "select";
  placeholder?: string;
  default?: string;
  options?: FilterOption[];
};

export interface GenericFiltersProps {
  fields: FilterField[];                   
  onSearch?: (values: Record<string, any>) => void;
  initial?: Record<string, any>;
  className?: string;
}

const Filters: React.FC<GenericFiltersProps> = ({
  fields,
  onSearch,
  initial = {},
  className = "mb-6",
}) => {
  const [state, setState] = useState<Record<string, any>>(() => ({ ...initial }));

  const handleChange = (key: string, value: any) =>
    setState((s) => ({ ...s, [key]: value }));

  const handleSearch = () => {
    onSearch?.(state);
  };

  return (
    <section className={`generic-filters ${className}`}>
      <div className="generic-filters-header">
        <div className="generic-filters-badge">
          1
        </div>
        <div className="filter-title">Preencher filtros</div>
      </div>
      <div className="generic-filter-line"></div>

      <div className="generic-filters-grid">
        {fields.map((f) => {
          if (f.type === "select") {
            return (
              <select
                key={f.key}
                value={state[f.key] ?? ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className=""
              >
                <option value="">{f.placeholder ?? f.label}</option>
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={f.key}
              value={state[f.key] ?? ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder ?? f.label}
              type={f.type ?? "text"}
            />
          );
        })}

        <div>
          <button className="btn-primary" onClick={handleSearch}>
            <MagnifyingGlassIcon size={16} />
            Consultar
          </button>
        </div>
      </div>
    </section>
  );
};

export default Filters;
