
export type TableColumn<T> = {
	key: keyof T | string;
	label: string;
	placeholder?: string;
	render?: (row: T) => React.ReactNode;
	controlled?: boolean; 
	type?: 'text' | 'number' | 'date' | 'switch';
	onToggle?: (row: T, checked: boolean) => void;
};

export type TableAction<T> = {
	key: string;
	label?: string;
	icon?: React.ReactNode;
	className?: string;
	onClick?: (row: T) => void;
};

export interface GenericTableProps<T extends Record<string, any>> {
	title?: string;
	columns: TableColumn<T>[];
	rows: T[];                        
	actions?: TableAction<T>[];
	perPage?: number;
	total?: number | null;
	onGenerateCSV?: () => void;
	className?: string;
  isReport?: boolean;
}