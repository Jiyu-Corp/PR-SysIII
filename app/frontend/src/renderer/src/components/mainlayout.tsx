import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'
import './MainLayout.css'

const mainlayout: React.FC = () => {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="main-column">
        <Header />
        <main className="content-area">
          <Outlet /> 
        </main>
      </div>
    </div>
  )
}

export default mainlayout
