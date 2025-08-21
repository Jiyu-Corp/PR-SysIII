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
