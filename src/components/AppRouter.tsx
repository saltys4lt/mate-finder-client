import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootState } from "../redux";
import { privateRoutes, publicRoutes } from "../routes/routes";
import Footer from "./Footer";
import Header from "./Header";



const AppRouter = () => {
 
  const isAuth=useSelector((state:RootState)=>state.userReducer.isAuth)
  return (
    <>
      <Header />
      <Routes>
      {isAuth
      ?privateRoutes.map(r=>
      <Route key={r.path}  path={r.path} element={r.element} />
      
        )
      :publicRoutes.map(r => 
        <Route key={r.path} path={r.path} element={r.element} />
      )
      }

      {isAuth
      ?<Route  path='*' element={<Navigate to='/home'/>} />
      :<Route  path='*' element={<Navigate to='/'/>} />
      }
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
