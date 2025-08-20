import React, { useState, MouseEvent, useEffect } from 'react'
import { AuthLayout } from '../components/AuthLayout/authlayout'
import { Input } from '../components/Input/input'
import { Button } from '../components/Button/button'
import { useNavigate } from 'react-router-dom'
import { CarProfileIcon } from '@phosphor-icons/react'
import './LoginPage.css'
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from 'react-loader-spinner'

export const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDefaultLogin();
  }, []);

  const fetchDefaultLogin = async () => {
    const response = await requestPRSYS('access', 'getDefault', 'GET');
    const defaultLogin = response;
    setLogin(defaultLogin);
  }

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

  const isLoginEmpty = login === '';
  return (
    <AuthLayout>
      {isLoginEmpty
        ? <Grid
            visible={true}
            height="80"
            width="80"
            color="#4A87E8"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{justifyContent: "center"}}
            wrapperClass="grid-wrapper"
          />
        : <>
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
              disabled={true}
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
        </>
      }
    </AuthLayout>
  )
}
