import './assets/main.css'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br"); 

createRoot(document.getElementById('root')!).render(
    
  <HashRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <App />
    </LocalizationProvider>
  </HashRouter>
)
