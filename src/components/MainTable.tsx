import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../redux';
import Table from '../consts/Table';
import fetchPlayers from '../redux/adminThunks/fetchPlayers';
import fetchAllMaps from '../redux/adminThunks/fetchAllMaps';

const MainTable = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (location.pathname === '/players') {
      dispatch(fetchPlayers());
    }
    if (location.pathname === '/maps') {
      dispatch(fetchAllMaps());
    }
  }, [location]);
  const CurrentTable = Table[location.pathname];
  return <CurrentTable />;
};

export default MainTable;
