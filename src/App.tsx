import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import GlobalStyle from './GlobalStyles'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useAppDispatch } from './redux'
import {  checkUserIsAuth } from './redux/usersSlice'
import { useSelector } from 'react-redux'
import { RootState } from './redux'

function App() {
  
  const token=Cookies.get('token')
  const dispatch=useAppDispatch()
  const isAuth=useSelector((state:RootState)=>state.userReducer.isAuth)
  useEffect(() => {
    if(token){
      dispatch(checkUserIsAuth())

    }
  }, [])
  console.log(isAuth)
  return (
    
    <BrowserRouter>
    <GlobalStyle/>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App
