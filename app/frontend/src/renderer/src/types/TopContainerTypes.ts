
export interface GenericTopProps {
	title?: string;
	subtitle?: React.ReactNode | null;
	actionLabel?: string | null;
	onAction?: React.MouseEventHandler<HTMLButtonElement>;
	onAction2?: React.MouseEventHandler<HTMLButtonElement>;
	actionIcon?: React.ReactNode;
	className?: string;
}