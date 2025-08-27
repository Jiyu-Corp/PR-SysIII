import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignOutIcon } from '@phosphor-icons/react'
import './Header.css'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const [now, setNow] = useState<string>('')

  function handleLogout() {
    localStorage.removeItem('isAuth')
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    function updateTime() {
      const date = new Date()
      const formatted =
        date.toLocaleDateString('pt-BR') + ' - ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
      setNow(formatted)
    }

    updateTime()
    const nowDate = new Date()
    const msUntilNextMinute = (60 - nowDate.getSeconds()) * 1000 - nowDate.getMilliseconds()

    const timeout = setTimeout(() => {
      updateTime()
      const interval = setInterval(updateTime, 60000) 
      
      return () => clearInterval(interval)
    }, msUntilNextMinute)

    return () => clearTimeout(timeout)
  }, [])

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
