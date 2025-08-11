import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SignOutIcon } from '@phosphor-icons/react'
import './Header.css'

const Header: React.FC = () => {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('isAuth')
    navigate('/login', { replace: true })
  }

  const now = '22:20 - 22/05/2025'

  return (
    <header className="app-header">
      <div className="header-left" aria-hidden="true">
      </div>

      <div className="header-center" role="status" aria-live="polite">
        <div className="header-time">{now}</div>
      </div>

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Sair
          <SignOutIcon size={17} />
        </button>
      </div>
    </header>
  )
}

export default Header
