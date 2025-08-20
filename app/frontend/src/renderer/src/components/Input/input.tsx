// Input.tsx
import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import './input.css'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelPosition?: 'top-left' | 'center'
}

export const Input: React.FC<Props> = ({
  label,
  labelPosition = 'center',
  type = 'text',
  ...rest
}) => {
  const [visible, setVisible] = useState(false)

  // if original type is password, allow toggle; otherwise keep type as-is
  const isPassword = type === 'password'
  const inputType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className={`input-group label-${labelPosition}`}>
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <input className="input-field" type={inputType} {...(rest as any)} />
        {isPassword && (
          <button
            type="button"
            className="input-toggle-btn"
            onClick={() => setVisible(v => !v)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            title={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {visible ? (
              <EyeSlashIcon size={18} weight="regular" />
            ) : (
              <EyeIcon size={18} weight="regular" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
