import { lazy,Suspense } from "react"
import StartPage from "../pages/StartPage"
import Loader from "../components/Loader"
const HomePage=lazy(()=>import('../pages/HomePage'))

export const privateRoutes=[
    {path:'/home', element:<Suspense fallback={<Loader/>}><HomePage/></Suspense> }
    
]

export const publicRoutes=[
    {path:'/', element:<StartPage/> }
]