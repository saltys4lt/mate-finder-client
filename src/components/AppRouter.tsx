import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { RootState } from '../redux';
import { authorizedGameProfileRoutes, privateRoutes, publicRoutes } from '../routes/routes';
import { Suspense } from 'react';
import Loader from './Loader';
import CreationPage from '../pages/CreationPage';
import useScrollToTop from '../hooks/useScrollToTop';
import Cookies from 'js-cookie';
const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const csgoData = useSelector((state: RootState) => state.userReducer.user?.cs2_data);
  const isGameCreationActive = useSelector((state: RootState) => state.userReducer.isGameCreationActive);
  useScrollToTop();

  return (
    <Routes>
      {isAuth
        ? privateRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)
        : publicRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
      {(isGameCreationActive || Cookies.get('rme') === 'true') && (
        <Route
          path='/creation/:game'
          element={
            <Suspense fallback={<Loader />}>
              <CreationPage />
            </Suspense>
          }
        />
      )}

      {csgoData && authorizedGameProfileRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
    </Routes>
  );
};

export default AppRouter;
