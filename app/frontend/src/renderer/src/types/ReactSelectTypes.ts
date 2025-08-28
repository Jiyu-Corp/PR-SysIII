export type SelectOption = {
  id: number | string,
  label: string
}

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[]
}