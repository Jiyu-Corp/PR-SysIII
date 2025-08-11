// src/renderer/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {LoginPage} from './pages/LoginPage'
import MainLayout from './components/mainlayout'
import Dashboard from './pages/Dashboard' 

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = !!localStorage.getItem('isAuth') // true/false
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* rota pública do login */}
      <Route path="/login" element={<LoginPage />} />

      {/* rota principal que contém o layout persistente */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        {/* rotas filhas renderizadas dentro do <Outlet /> do MainLayout */}
        <Route index element={<Dashboard />} />
      </Route>

      {/* fallback — se usuário abrir só #/ ou rota desconhecida */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
