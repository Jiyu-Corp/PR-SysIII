// src/renderer/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {LoginPage} from './pages/LoginPage'
import MainLayout from './components/MainLayout/mainlayout'
import Dashboard from './pages/Dashboard' 
import Clientes from './pages/Clientes' 
import VeiculosPage from './pages/Veiculos'
import TabelaPrecoPage from './pages/TabelaPreco'
import ConvenioPage from './pages/Convenios'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = !!sessionStorage.getItem('jwt_token') // true/false

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
        <Route path='/dashboard' index element={<Dashboard />} />
        <Route path='/clientes' index element={<Clientes />} />
        <Route path='/veiculos' index element={<VeiculosPage />} />
        <Route path='/convenios' index element={<ConvenioPage />} />
        <Route path='/tabela-preco' index element={<TabelaPrecoPage />} />
      </Route>

      {/* fallback — se usuário abrir só #/ ou rota desconhecida */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
