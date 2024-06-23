import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { RootState } from '../redux';
import { adminRoutes, authorizedGameProfileRoutes, privateRoutes, publicRoutes } from '../routes/routes';
import { Suspense, useEffect } from 'react';
import Loader from './Loader';
import CreationPage from '../pages/CreationPage';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const isAdmin = useSelector((state: RootState) => state.userReducer.isAdmin);
  const navigate = useNavigate();
  const csgoData = useSelector((state: RootState) => state.userReducer.user?.cs2_data);
  const isGameCreationActive = useSelector((state: RootState) => state.userReducer.isGameCreationActive);
  useEffect(() => {
    if (isAdmin) navigate('/players');
  }, [isAdmin]);

  useScrollToTop();
  console.log(isGameCreationActive);
  return isAdmin ? (
    <Routes>
      {adminRoutes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Routes>
  ) : (
    <Routes>
      {isAuth
        ? privateRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)
        : publicRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
      {isGameCreationActive === 'cs2' && (
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
