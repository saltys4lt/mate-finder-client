import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MainTable from '../components/MainTable';

import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import { setCurrentPage } from '../redux/adminSlice';
import AdminFilterBar from '../components/AdminFilterBar';
import { useLocation } from 'react-router-dom';
const AdminControlPage = () => {
  const currentPage = useSelector((state: RootState) => state.adminReducer.currentPage);
  const totalPages = useSelector((state: RootState) => state.adminReducer.totalPages);
  const dispatch = useAppDispatch();
  const location = useLocation();
  return (
    <>
      <Main>
        <MainContent>
          <SideNavbar>
            <NavLink to={'/players'}>Игроки</NavLink>
            <NavLink to={'/maps'}>Карты</NavLink>
          </SideNavbar>
          <MainTable />
          {location.pathname === '/players' && <AdminFilterBar />}
        </MainContent>
        <PaginationContainer>
          {location.pathname === '/players' && (
            <Pagination
              color='secondary'
              count={totalPages}
              page={currentPage}
              onChange={(_, value: number) => {
                dispatch(setCurrentPage(value));
              }}
            />
          )}
        </PaginationContainer>
      </Main>
    </>
  );
};
const PaginationContainer = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const Main = styled.main`
  background-color: #333;
`;

const MainContent = styled.div`
  height: 80vh;
  display: flex;
  justify-content: space-between;
`;

const SideNavbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: aliceblue;
  height: 100%;
  width: 9%;
`;

const NavLink = styled(Link)`
  font-size: 20px;
  text-decoration: none;
  color: #000;
  font-weight: 700;
  &:hover {
    color: #757575;
  }
`;

export default AdminControlPage;
