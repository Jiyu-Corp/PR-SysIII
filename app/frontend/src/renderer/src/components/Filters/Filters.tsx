import React, { useState } from "react";
import './Filters.css'
import {MagnifyingGlassIcon} from '@phosphor-icons/react';
import type { FilterField, GenericFiltersProps } from "../../types/FilterTypes";
import InputModal from "../../modals/InputModal/InputModal";
import SelectModal from "../../modals/SelectModal/SelectModal";
import DatePickerField from "../DatePicker/DatePicker"; 

const Filters: React.FC<GenericFiltersProps> = ({
  title,
  fields,
  onSearch,
  initial = {},
  className = "mb-6",
  buttons,
  style
}) => {
  const [state, setState] = useState<Record<string, any>>(() => ({ ...initial }));

  const handleChange = (key: string, value: any) =>
    setState((s) => ({ ...s, [key]: value }));

  const handleSearch = () => {
    onSearch?.(state);
  };
  console.log(style)
  return (
    <section className={`generic-filters ${className}`}>
      <div className={`generic-filters-header  ${style}`}>
        <div className="generic-filters-header-info">
          <h1 className="generic-filters-title">{title}</h1>
        </div>
        <div className='generic-filters-header-actions'>
          {buttons?.map((buttonElement, index) => (
            <React.Fragment key={buttonElement.key ?? index}>
              {buttonElement}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="generic-filters-grid">
        {fields.map((f) => {
          if (f.type === "select") {
            return (
              <SelectModal
                key={f.key}
                value={state[f.key] ?? ""}
                options={f.options ?? []}
                label={f.label ?? f.key}
                setValue={(newValue: string) => handleChange(f.key, newValue)}
                selectClass="filters-select"
              />
            );
          }

          if (f.type === "date") {
            return (
              <div key={f.key} className="filters-date">
                <DatePickerField
                  label={f.label ?? f.key}
                  value={state[f.key] ?? ""}
                  onChange={(newIsoString) => handleChange(f.key, newIsoString)}
                  size="small"
                />
              </div>
            );
          }

          return (
            <InputModal
              key={f.key}
              value={state[f.key] ?? ""}
              setValue={(newValue: string) => setState((s) => ({ ...s, [f.key]: newValue }))}
              label={f.label ?? f.key}
              mask={f.mask ? f.mask(state[f.key] ?? "") : undefined}
              replacement={f.replacement}
              unformat={f.unformater}
              onChange={f.onChange ? (value) => f.onChange!(value, (newValue: string) => setState((s) => ({ ...s, [f.key]: newValue }))) : undefined}
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
