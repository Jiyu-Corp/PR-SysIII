import React from "react";
import './TopContainer.css'
import type { GenericTopProps } from "../../types/TopContainerTypes.ts";

const TopContainer: React.FC<GenericTopProps> = ({
  title = "Título",
  subtitle = null,
  actionLabel = null,
  onAction,
  actionLabel2 = null,
  onAction2,
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
          {actionLabel2 && 
            <button
              type="button"
              onClick={onAction2}
              className="btn"
            >
              <span>{actionLabel2}</span>
            </button>
          }
        </div>
      )}
    </div>
  );
};

export default TopContainer;
