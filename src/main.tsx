
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/index.ts'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'    


ReactDOM.createRoot(document.getElementById('root')!).render(
<Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
         <App />
    </LocalizationProvider>
</Provider>
  
  
)
