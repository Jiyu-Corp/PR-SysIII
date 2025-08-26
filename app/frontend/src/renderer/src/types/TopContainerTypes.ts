
export interface GenericTopProps {
	title?: string;
	subtitle?: React.ReactNode | null;
	actionLabel?: string | null;
	onAction?: React.MouseEventHandler<HTMLButtonElement>;
  actionLabel2?: string | null;
	onAction2?: React.MouseEventHandler<HTMLButtonElement>;
	actionIcon?: React.ReactNode;
	className?: string;
}