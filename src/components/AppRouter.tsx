import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from '../redux';
import { adminRoutes, authorizedGameProfileRoutes, privateRoutes, publicRoutes } from '../routes/routes';
import { Suspense, useEffect } from 'react';
import Loader from './Loader';
import CreationPage from '../pages/CreationPage';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setGameCreationActive } from '../redux/userSlice';
const AppRouter = () => {
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const isAdmin = useSelector((state: RootState) => state.userReducer.isAdmin);
  const navigate = useNavigate();
  const csgoData = useSelector((state: RootState) => state.userReducer.user?.cs2_data);
  const isGameCreationActive = useSelector((state: RootState) => state.userReducer.isGameCreationActive);
  useEffect(() => {
    if (isAdmin) navigate('/players');
    if (Cookies.get('_gc') === 'cs2') {
      setGameCreationActive('cs2');
    }
  }, [isAdmin]);

  useScrollToTop();

  return isAdmin ? (
    <Routes>
      {adminRoutes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Routes>
  ) : (
    <Routes>
      {isAuth
        ? isGameCreationActive !== 'cs2' && privateRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)
        : isGameCreationActive !== 'cs2' && publicRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
      {isGameCreationActive === 'cs2' && (
        <>
          <Route
            path='/creation/cs2'
            element={
              <Suspense fallback={<Loader />}>
                <CreationPage />
              </Suspense>
            }
          />

          <Route path='*' element={<Navigate to={'/creation/cs2'} />} />
        </>
      )}

      {csgoData?.maps.length !== 0 && authorizedGameProfileRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
    </Routes>
  );
};

export default AppRouter;
