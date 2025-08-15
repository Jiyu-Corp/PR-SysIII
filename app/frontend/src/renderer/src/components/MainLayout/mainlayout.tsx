import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/header'
import Sidebar from '../Sidebar/sidebar'
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
