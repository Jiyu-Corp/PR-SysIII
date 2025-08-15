import React from 'react'
import './AuthLayout.css'

interface Props {
  children: React.ReactNode
}

export const AuthLayout: React.FC<Props> = ({ children }) => (
  <div className="auth-shell">
    <div className="auth-window">
      {children}
    </div>
  </div>
)
