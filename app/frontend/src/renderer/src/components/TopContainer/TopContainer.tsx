// GenericTop.tsx
import React from "react";
import './TopContainer.css'

export interface GenericTopProps {
  title?: string;
  subtitle?: React.ReactNode | null;
  actionLabel?: string | null;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  actionIcon?: React.ReactNode;
  className?: string;
}

const TopContainer: React.FC<GenericTopProps> = ({
  title = "Título",
  subtitle = null,
  actionLabel = null,
  onAction,
  actionIcon,
  className = "mb-6",
}) => {
  return (
    <div className={`generic-top ${className}`}>
      <div>
        <h2 className="generic-top-title">{title}</h2>
        {subtitle && <div className="generic-top-subtitle">{subtitle}</div>}
      </div>

      {actionLabel && (
        <div>
          <button
            type="button"
            onClick={onAction}
            className="btn"
          >
            <span>{actionLabel}</span>
            {actionIcon}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopContainer;
