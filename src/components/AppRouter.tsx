import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { RootState } from '../redux';
import {
  authorizedGameProfileRoutes,
  privateRoutes,
  publicRoutes,
} from '../routes/routes';
import Footer from './Footer';
import Header from './Header';

const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const csgoData = useSelector(
    (state: RootState) => state.userReducer.user?.csgo_data,
  );
  const valorantData = useSelector(
    (state: RootState) => state.userReducer.user?.valorant_data,
  );

  return (
    <>
      <Header />
      <Routes>
        {isAuth
          ? privateRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))
          : publicRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
        {(csgoData || valorantData) &&
          authorizedGameProfileRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
