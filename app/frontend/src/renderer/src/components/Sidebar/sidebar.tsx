import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h1 className="main-title">
        <span className="main-title--blue">PR</span>
        <span className="main-title--black">sys</span>
      </h1>
      <nav className="nav">
        <NavLink to="/dashboard" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Entradas/Saídas</span>
        </NavLink>

        <NavLink to="/clientes" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Clientes</span>
        </NavLink>

        <NavLink to="/veiculos" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Veículos</span>
        </NavLink>

        <NavLink to="/convenios" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Convênios</span>
        </NavLink>

        <NavLink to="/tabela-preco" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Tabela de Preços</span>
        </NavLink>

        <NavLink to="/modelo-ticket" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Modelo de Ticket</span>
        </NavLink>

        <NavLink to="/acesso" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Acesso</span>
        </NavLink>

        <NavLink to="/tipo-veiculo" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Tipo de Veiculo</span>
        </NavLink>

        {/* damn itens */}
      </nav>
    </aside>
  )
}

export default Sidebar
