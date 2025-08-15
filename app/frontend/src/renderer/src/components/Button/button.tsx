import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const Button: React.FC<Props> = ({ children, ...rest }) => (
  <button
    style={{
      width: '25%',
      padding: '10px',
      backgroundColor: '#3BB273',
      color: 'white',
      border: 'none',
      borderRadius: 4,
      fontSize: 16,
      cursor: 'pointer',
    }}
    {...rest}
  >
    {children}
  </button>
)
