import React from "react";
import { Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../routes/routes";
import Header from "./Header";
import Footer from "./Footer";
import Cookies from 'js-cookie';

const AppRouter = () => {
 
  const token=Cookies.get('token')



  
  
  return (
    <>
      <Header />
      <Routes>

        {publicRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
