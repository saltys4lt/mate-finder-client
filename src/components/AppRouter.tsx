import React from 'react'
import { Routes,Route} from 'react-router-dom'
import { publicRoutes,privateRoutes } from '../routes/routes'
const AppRouter = () => {
  return (
    <Routes>
        {publicRoutes.map(r=><Route path={r.path} element={r.element}/>)

        }
    </Routes>
  )
}

export default AppRouter