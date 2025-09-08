import React from "react";
import { SelectOption, SelectOptionGroup } from "./ReactSelectTypes";
import ButtonModal from "@renderer/modals/ButtonModal/ButtonModal";

export type FilterOption = { id: number; label: string };

export type FilterField = {
  key: string;
  label?: string;
  placeholder?: string;
  mask?: (value: string) => string;
  replacement?: {};
  type?: "text" | "select" | "date";
  unformater?: (value: string) => string; 
  onChange?: (value: string, setter: ((React.Dispatch<React.SetStateAction<any>>) | ((string) => void))) => void;
  default?: string;
  options?: SelectOption[] | SelectOptionGroup[];
};

export interface GenericFiltersProps {
  title: string;
  fields: FilterField[];
  onSearch?: (values: Record<string, any>) => void;
  initial?: Record<string, any>;
  className?: string;
  buttons?: React.ReactElement<typeof ButtonModal>[];
  style?: string
}
