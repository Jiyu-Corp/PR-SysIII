import React, { useState, MouseEvent, useEffect } from 'react'
import { AuthLayout } from '../components/AuthLayout/authlayout'
import { Input } from '../components/Input/input'
import { Button } from '../components/Button/button'
import { useNavigate } from 'react-router-dom'
import { CarProfileIcon } from '@phosphor-icons/react'
import './LoginPage.css'
import { requestPRSYS } from '@renderer/utils/http'
import { Grid } from 'react-loader-spinner'
import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      username: login,
      password: senha
    }
    try {
      const loginRes = await requestPRSYS('access', 'login', 'POST', body);
      
      const jwtToken = loginRes.authToken;
      sessionStorage.setItem('jwt_token', jwtToken);
      
      navigate('/', { replace: true });
    } catch(err) { 
      toast.error('Senha incorreta.', {
        style: {
          padding: '16px',
          color: '#C1292E',
        },
        iconTheme: {
          primary: '#C1292E',
          secondary: '#FFFAEE',
        },
      });
      console.log(err);
    }
    
  }

  async function handleForgotPassword(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  
    const result = await Swal.fire({
      title: 'Confirmação',
      text: 'Tem certeza que deseja resetar a senha?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, resetar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });
  
    if (result.isConfirmed) {
      try {
        const res = requestPRSYS('access', 'forgotPassword', 'POST', {
          idAccess: 1
        });

        toast.promise(res, 
          {
            loading: 'Resetando...',
            success: `Senha resetada`,
            error: `Erro ao resetar senha`,
          },
          {
            style: {
              padding: '16px',
              color: '#4A87E8',
            },
            iconTheme: {
              primary: '#4A87E8',
              secondary: '#FFFAEE',
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
  

  const isLoginEmpty = login === '';
  return (
    <AuthLayout>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
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
