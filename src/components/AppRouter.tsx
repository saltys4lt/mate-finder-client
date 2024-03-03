import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { RootState } from '../redux';
import { authorizedGameProfileRoutes, privateRoutes, publicRoutes } from '../routes/routes';
import { Suspense } from 'react';
import Loader from './Loader';
import CreationPage from '../pages/CreationPage';

const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const csgoData = useSelector((state: RootState) => state.userReducer.user?.cs2_data);
  const valorantData = useSelector((state: RootState) => state.userReducer.user?.valorant_data);
  const isGameCreationActive = useSelector((state: RootState) => state.userReducer.isGameCreationActive);

  return (
    <Routes>
      {isAuth
        ? privateRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)
        : publicRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
      {isGameCreationActive && (
        <Route
          path='/creation/:game'
          element={
            <Suspense fallback={<Loader />}>
              <CreationPage />
            </Suspense>
          }
        />
      )}

      {(csgoData || valorantData) && authorizedGameProfileRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
    </Routes>
  );
};

export default AppRouter;
