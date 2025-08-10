import React from 'react'
import './input.css'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelPosition?: 'top-left' | 'center'
}

export const Input: React.FC<Props> = ({
  label, labelPosition = 'center', ...rest
}) => (
  <div className={`input-group label-${labelPosition}`}>
    <label className="input-label">{label}</label>
    <input className="input-field" {...rest} />
  </div>
)
