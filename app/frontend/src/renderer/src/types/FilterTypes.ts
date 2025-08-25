export type FilterOption = { value: string; label: string };

export type FilterField = {
  key: string;
  label?: string;
  mask?: (value: string) => string;
  replacement?: {};
  type?: "text" | "select";
  unformater?: (value: string) => string; 
  onChange?: (value: string, setter: React.Dispatch<React.SetStateAction<any>>) => void;
  default?: string;
  options?: FilterOption[];
};

export interface GenericFiltersProps {
  fields: FilterField[];
  onSearch?: (values: Record<string, any>) => void;
  initial?: Record<string, any>;
  className?: string;
}
