import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../routes/routes";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { RootState } from "../redux";



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
