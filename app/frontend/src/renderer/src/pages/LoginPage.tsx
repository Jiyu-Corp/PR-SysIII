import React, { useState, MouseEvent } from 'react'
import { AuthLayout } from '../components/authlayout'
import { Input } from '../components/input'
import { Button } from '../components/button'
import './LoginPage.css'

// const { access } = window.electron

export const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ login, senha })
  }

  async function handleForgotPassword(evt: MouseEvent) {
    evt.preventDefault()
    evt.stopPropagation()
    // const result = await access.forgotPassword()
    // console.log('Forgot password:', result)
  }

  return (
    <AuthLayout>
      <header className="login-header">
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
