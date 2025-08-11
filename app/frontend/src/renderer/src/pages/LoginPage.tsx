import React, { useState, MouseEvent } from 'react'
import { AuthLayout } from '../components/authlayout'
import { Input } from '../components/input'
import { Button } from '../components/button'
import { useNavigate } from 'react-router-dom'
import { CarProfileIcon } from '@phosphor-icons/react'
import './LoginPage.css'
import { requestPRSYS } from '@renderer/utils/http'

export const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('isAuth', '1')

    navigate('/', { replace: true })
  }

  async function handleForgotPassword(evt: MouseEvent) {
    evt.preventDefault()
    evt.stopPropagation()
    const result = await requestPRSYS('access', 'forgotPassword', 'POST', {
      idAccess: 1
    })
    console.log('Forgot password:', result)
  }

  return (
    <AuthLayout>
      <header className="login-header">
        <CarProfileIcon size={48} weight="duotone" className="login-logo" />
        <h1 className="login-title">
            <span className="login-title--blue">PR</span>
            <span className="login-title--black">sys</span>
        </h1>
      </header>

      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          label="Login"
          labelPosition="top-left"
          type="text"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />
        <Input
          label="Senha"
          labelPosition="top-left"
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <div className="login-footer">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="login-forgot"
          >
            Esqueceu a senha?
          </a>
          <Button type="submit" className="login-submit">
            Entrar
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
